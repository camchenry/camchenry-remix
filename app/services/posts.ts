import LRUCache from "lru-cache";
import fs from "../fs";
import path from "../path";
import { convertMarkdownToHtml } from "./markdown.server";

const postCache = new LRUCache<string, PostData>({
  maxAge:
    process.env.NODE_ENV === "production" ? 1000 * 60 * 60 * 24 * 7 : 2500,
});

export type PostMetadata = {
  title: string;
  summary: string;
  publishedAt: string;
  tags?: string[];
  type?: "guide" | "post";
  published?: boolean;
};

export type PostData = {
  text: string;
  id: string;
  metadata: PostMetadata;
};

export function isPost(post: unknown): post is PostData {
  const casted = post as PostData;
  return (
    typeof post === "object" &&
    post !== null &&
    post !== undefined &&
    "text" in post &&
    typeof casted.text === "string" &&
    "id" in post &&
    typeof casted.id === "string" &&
    isPostMetadata(casted.metadata)
  );
}

export function isPostMetadata(metadata: unknown): metadata is PostMetadata {
  const casted = metadata as PostMetadata;
  return (
    typeof metadata === "object" &&
    metadata !== undefined &&
    metadata !== null &&
    "title" in metadata &&
    "summary" in metadata &&
    "publishedAt" in metadata &&
    typeof casted.title === "string" &&
    typeof casted.summary === "string" &&
    typeof casted.publishedAt === "string" &&
    "tags" in metadata &&
    Array.isArray(casted.tags) &&
    casted.tags.every((tag) => typeof tag === "string")
  );
}

export function notNullOrUndefined<TValue>(
  value: TValue | undefined | null
): value is TValue {
  if (value === null || value === undefined) return false;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const testDummy: TValue = value;
  return true;
}

export async function getPosts(): Promise<PostData[]> {
  const postsPath = path.join(__dirname, `../../posts`);
  const entries = fs.readdirSync(postsPath);
  const posts = await Promise.all(
    entries
      .filter((entry) => entry.endsWith(".md"))
      .map((entry) => entry.replace(".md", ""))
      .map((postName) => getPost(postName))
      .filter(notNullOrUndefined)
  );
  const filtered = posts
    .filter(notNullOrUndefined)
    .sort(
      (a, b) =>
        -1 * a.metadata.publishedAt.localeCompare(b.metadata.publishedAt)
    );
  return filtered;
}

async function generatePostFromMarkdown(postId: string | undefined) {
  const postPath = path.join(__dirname, `../../posts/${postId}.md`);
  if (!fs.existsSync(postPath)) {
    return null;
  }
  if (!postId) {
    return null;
  }
  const file = fs.readFileSync(postPath);
  const { html, frontmatter: metadata } = await convertMarkdownToHtml(
    file.toString()
  );
  if (!isPostMetadata(metadata)) {
    throw new Error("Failed to parse post metadata");
  }
  const postData: PostData = {
    text: html,
    id: postId,
    metadata,
  };
  if (!isPost(postData)) {
    throw new Error("Failed to parse post");
  }
  return postData;
}

export async function getPost(
  postId: string | undefined
): Promise<PostData | null | undefined> {
  if (!postId) {
    return null;
  }
  let post: PostData | null | undefined;
  if (postCache.has(postId)) {
    post = postCache.get(postId);
  } else {
    post = await generatePostFromMarkdown(postId);
    if (post) {
      postCache.set(postId, post);
    }
  }

  return post;
}
