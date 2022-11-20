---
title: "How to add a RSS feed to a Remix app"
summary: "Remix allows you to generate responses for any kind of page, not just rendering React components, which can be used to easily create a RSS feed for a blog."
publishedAt: "2022-11-20"
tags:
  - remix
type: til # 'guide' or 'post' or 'til'
published: true
---

One of the advantages of using Remix is that you have access to the server side code and can easily generate responses for any kind of page, not just rendering React components. For example, you can create a RSS feed for your blog fairly easily.

Since I first created my website, Remix added a new feature, called [resource routes](https://remix.run/docs/en/v1/guides/resource-routes#creating-resource-routes), which are essentially pages that do not render any components and instead just return some data (JSON, XML, etc), which is perfect for making a RSS feed.

I set up my RSS feed under the root path: `camchenry.com/rss.xml`. I created a file called `[rss.xml].tsx` in the `app/routes` directory. The file name contains brackets `[]`, because Remix normally converts a period (`.`) to a slash in the URL by convention. But we want to change the URL to contain `.xml`, so we need to escape it by using the brackets.

Every RSS file has a number of [required and optional fields](https://validator.w3.org/feed/docs/rss2.html), but in this case we're only using the bare minimum of required fields to get it working.

A RSS file is essentially just a list of items, so we create a type definition for each entry:

```tsx
// app/routes/[rss.xml].tsx
export type RssEntry = {
  title: string;
  link: string;
  description: string;
  pubDate: string;
  author?: string;
  guid?: string;
};
```

Then, we will define a function to generate the XML for the RSS feed based on our list of RSS entries:

```tsx
export function generateRss({
  description,
  entries,
  link,
  title,
}: {
  title: string;
  description: string;
  link: string;
  entries: RssEntry[];
}): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${title}</title>
    <description>${description}</description>
    <link>${link}</link>
    <language>en-us</language>
    <ttl>60</ttl>
    <atom:link href="https://YOUR_SITE_HERE.com/rss.xml" rel="self" type="application/rss+xml" />
    ${entries
      .map(
        (entry) => `
      <item>
        <title><![CDATA[${entry.title}]]></title>
        <description><![CDATA[${entry.description}]]></description>
        <pubDate>${entry.pubDate}</pubDate>
        <link>${entry.link}</link>
        ${entry.guid ? `<guid isPermaLink="false">${entry.guid}</guid>` : ""}
      </item>`
      )
      .join("")}
  </channel>
</rss>`;
}
```

A few notes:

- The `guid` tag is used to uniquely identify the piece of content, and can just be the URL of the content, hence why it also has the `isPermaLink` attribute set to `false` to indicate that the URL may change.
- Change the `https://YOUR_SITE_HERE.com/rss.xml` on `<atom:link>` to be wherever your `[rss.xml].tsx` file is located.

Finally, to create a resource route, we need to export a `loader` from our file without exporting any other functions. Instead of rendering HTML like normal, the server will render this response instead:

```tsx
export const loader: LoaderFunction = async () => {
  const posts = await getPosts();

  const feed = generateRss({
    title: "My Blog",
    description: "My Blog",
    link: "https://YOUR_SITE_HERE.com/blog",
    entries: posts.map((post) => ({
      description: post.metadata.summary,
      pubDate: new Date(post.metadata.publishedAt).toUTCString(),
      title: post.metadata.title,
      link: `https://YOUR_SITE_HERE.com/blog/${post.id}`,
      guid: `https://YOUR_SITE_HERE.com/blog/${post.id}`,
    })),
  });

  return new Response(feed, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=2419200",
    },
  });
};
```

A brief explanation of some of the code above:

- The `getPosts` function could be replaced by however you get your blog posts (like from an API), but I just happen to have a service function for this.
- Some of the details of this are specific to how I store data, feel free to replace these with your own values:
  - `post.metadata.summary`
  - `post.metadata.publishedAt`
  - `post.metadata.title`
- The headers ensure that the page is recognized as XML, that it will be cached for 2419200 seconds (4 weeks).

Now when we visit `/rss.xml` we should see a XML RSS feed!
