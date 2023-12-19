import { LoaderFunction } from "@remix-run/node";
import { getPosts } from "../services/posts.server";
import globby from "globby";
import { generateSitemap } from "../services/sitemap";

export const loader: LoaderFunction = async () => {
  const getDate = new Date().toISOString();

  const staticPages = (
    await globby([
      // include
      "./app/routes/**/*.tsx",
      "./app/routes/*.tsx",
      // exclude
      "!./app/routes/**/$*", // skips dynamic routes
      "!./app/routes/404.tsx",
      // exclude files with brackets like [sitemap.xml].tsx
      "!./app/routes/**/\\[*\\].tsx",
    ])
  ).map((path) => {
    return {
      url: path,
      lastmod: getDate,
    };
  });

  const dynamicPages = [
    ...(await getPosts()).map((post) => {
      return {
        url: `blog/${post.id}`,
        lastmod: new Date(post.metadata.publishedAt).toISOString(),
      };
    }),
  ];

  const pages = [...staticPages, ...dynamicPages];

  const formattedPages = pages.map(({ ...page }) => {
    return {
      ...page,
      url: page.url
        .replace("./app/routes/", "")
        .replace(".tsx", "")
        .replace(/\/index/g, ""),
    };
  });

  const generatedSitemap = generateSitemap(formattedPages, {
    hostname: "https://camchenry.com",
  });

  return new Response(generatedSitemap, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=86400",
    },
  });
};
