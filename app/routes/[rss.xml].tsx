import { LoaderFunction } from "@remix-run/node";
import { getPosts } from "../services/posts.server";

export type RssEntry = {
  title: string;
  link: string;
  description: string;
  pubDate: string;

  // Optional
  author?: string;
  guid?: string;
};

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
    <atom:link href="https://camchenry.com/rss.xml" rel="self" type="application/rss+xml" />
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

export const loader: LoaderFunction = async () => {
  const posts = await getPosts();
  const feed = generateRss({
    title: "Cam McHenry Blog",
    description: "Cam McHenry's Blog",
    link: "https://camchenry.com/blog",
    entries: posts.map((post) => ({
      description: post.metadata.summary,
      pubDate: new Date(post.metadata.publishedAt).toUTCString(),
      title: post.metadata.title,
      link: `https://camchenry.com/blog/${post.id}`,
      guid: `https://camchenry.com/blog/${post.id}`,
    })),
  });
  return new Response(feed, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=2419200",
    },
  });
};
