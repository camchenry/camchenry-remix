import { getCollection, getEntry, type CollectionEntry } from "astro:content";

export type Post = CollectionEntry<"blog">;

export const featuredPostIds = [
  "eslint-custom-rules",
  "typescript-type-guards",
  "typescript-union-type",
];

export async function getPosts(): Promise<Post[]> {
  const posts = await getCollection("blog");
  return posts.sort((left, right) =>
    right.data.publishedAt.localeCompare(left.data.publishedAt),
  );
}

export async function getPost(id: string): Promise<Post | undefined> {
  return await getEntry("blog", id);
}

export async function getTags(): Promise<string[]> {
  const posts = await getPosts();
  return Array.from(new Set(posts.flatMap((post) => post.data.tags)));
}