export type SitemapEntry = {
  url: string;
  lastmod?: string;
  changefreq?: string;
  priority?: string;
};

export function generateSitemap(
  entries: SitemapEntry[],
  { hostname }: { hostname: string }
): string {
  // remove duplicates (such as /projects.tsx and /projects/index.tsx)
  const filteredPages = Array.from(new Set(entries));

  const pagesSitemap = `${filteredPages
    .map(({ url, lastmod, changefreq, priority }) => {
      const routePath = url === "index" ? "" : url;
      return `\n  <url>
  <loc>${hostname}/${routePath}</loc>
  <lastmod>${lastmod}</lastmod>
  <changefreq>${changefreq ?? "daily"}</changefreq>
  <priority>${priority ?? 0.5}</priority>
</url>`;
    })
    .join("")}`;

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd"
>${pagesSitemap}
</urlset>
  `;
}
