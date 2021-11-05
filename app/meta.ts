export type MetaFields =
  | "title"
  | "description"
  | "twitter:card"
  | "twitter:title"
  | "twitter:description"
  | "twitter:creator"
  | "twitter:image"
  | "og:title"
  | "og:description"
  | "og:image"
  | "og:url";

export const defaultTitle = "Cameron McHenry";

export const defaultDescription =
  "Cameron McHenry is passionate about building web applications and tools that make the world better.";

export const defaultMeta: Partial<Record<MetaFields, string>> = {
  title: defaultTitle,
  description: defaultDescription,
  "og:title": defaultTitle,
  "og:description": defaultDescription,
  "twitter:creator": "@cammchenry",
  "twitter:card": "summary",
  "twitter:title": defaultTitle,
  "twitter:description": defaultDescription,
};

type GenerateMeta = {
  title: string;
  description: string;
  image?: string;
  canonicalUrl?: string;
};

export const generateMeta = ({
  title,
  description,
  image,
  canonicalUrl,
}: GenerateMeta): Partial<Record<MetaFields, string>> => ({
  ...defaultMeta,
  title,
  description,
  "og:title": title,
  ...(canonicalUrl !== undefined && {
    "og:url": canonicalUrl,
  }),
  "og:description": description,
  "twitter:title": title,
  "twitter:description": description,
  ...(image !== undefined && {
    "og:image": image,
    "twitter:image": image,
    "twitter:card": "summary_large_image",
  }),
});