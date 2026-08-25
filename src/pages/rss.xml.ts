import type { APIRoute } from "astro";
import { getPosts } from "../lib/posts";

export const prerender = true;

export const GET: APIRoute = async () => {
  const posts = await getPosts();
  const items = posts
    .map(
      (post) => `
      <item>
        <title><![CDATA[${post.data.title}]]></title>
        <description><![CDATA[${post.data.summary}]]></description>
        <pubDate>${new Date(post.data.publishedAt).toUTCString()}</pubDate>
        <link>https://camchenry.com/blog/${post.id}</link>
        <guid isPermaLink="false">https://camchenry.com/blog/${post.id}</guid>
      </item>`,
    )
    .join("");

  const feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Cam McHenry Blog</title>
    <description>Cam McHenry's Blog</description>
    <link>https://camchenry.com/blog</link>
    <language>en-us</language>
    <ttl>60</ttl>
    <atom:link href="https://camchenry.com/rss.xml" rel="self" type="application/rss+xml" />
    ${items}
  </channel>
</rss>`;

  return new Response(feed, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=2419200",
    },
  });
};