import type { APIRoute } from "astro";
import { getPosts, getTags } from "../lib/posts";

export const prerender = true;

export const GET: APIRoute = async () => {
  const posts = await getPosts();
  const tags = await getTags();
  const generatedAt = new Date().toISOString();
  const entries = [
    { url: "", lastmod: generatedAt },
    { url: "blog", lastmod: generatedAt },
    ...posts.map((post) => ({
      url: `blog/${post.id}`,
      lastmod: new Date(
        post.data.updatedAt ?? post.data.publishedAt,
      ).toISOString(),
    })),
    ...tags.map((tag) => ({ url: `blog/tag/${tag}`, lastmod: generatedAt })),
  ];
  const pages = entries
    .map(
      ({ url, lastmod }) => `
  <url>
  <loc>https://camchenry.com/${url}</loc>
  <lastmod>${lastmod}</lastmod>
  <changefreq>daily</changefreq>
  <priority>0.5</priority>
</url>`,
    )
    .join("");

  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd"
>${pages}
</urlset>
  `,
    {
      headers: {
        "Content-Type": "application/xml",
        "Cache-Control": "public, max-age=86400",
      },
    },
  );
};
