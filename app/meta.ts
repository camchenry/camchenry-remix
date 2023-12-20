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
  | "og:url"
  | "og:type";

export const defaultTitle = "Cam McHenry";

export const defaultDescription =
  "I am a software engineer. I'm passionate about building great web applications and tools with JavaScript.";

export const defaultMeta: Partial<Record<MetaFields, string>> = {
  title: defaultTitle,
  description: defaultDescription,
  "og:title": defaultTitle,
  "og:description": defaultDescription,
  "og:type": "website",
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
  isArticle?: boolean;
};

export const generateMeta = ({
  title,
  description,
  image,
  canonicalUrl,
  isArticle = false,
}: GenerateMeta): Partial<Record<MetaFields, string>> => ({
  ...defaultMeta,
  title,
  description,
  "og:title": title,
  "og:type": isArticle ? "article" : "website",
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
