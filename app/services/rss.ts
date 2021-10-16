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
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${title}</title>
    <description>${description}</description>
    <link>${link}</link>
    <language>en-us</language>
    <ttl>60</ttl>
    ${entries
      .map(
        (entry) => `
      <item>
        <title><![CDATA[${entry.title}]]></title>
        <description><![CDATA[${entry.description}]]></description>
        <pubDate>${entry.pubDate}</pubDate>
        <link>${entry.link}</link>
        ${entry.author ? `<author>${entry.author}</author>` : ""}
        ${entry.guid ? `<guid>${entry.guid}</guid>` : ""}
      </item>
    `
      )
      .join("")}
  </channel>
</rss>`;

  return xml;
}
