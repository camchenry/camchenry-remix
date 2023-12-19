import LRUCache from "lru-cache";
import fs from "../fs";
import path from "../path";
import { convertMarkdownToHtml } from "./markdown.server";
import { timeit } from "./profiling.server";

const postCache = new LRUCache<
  { id: string; onlyRenderMetadata: boolean },
  PostData
>({
  maxAge:
    process.env.NODE_ENV === "production" ? 1000 * 60 * 60 * 24 * 7 : 2500,
});

export type PostMetadata = {
  title: string;
  summary: string;
  publishedAt: string;
  updatedAt?: string;
  tags?: string[];
  type?: "guide" | "post" | "til";
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

export async function getPosts({
  onlyRenderMetadata,
}: { onlyRenderMetadata?: boolean } = {}): Promise<PostData[]> {
  const postsPath = path.join(__dirname, `../../posts`);
  const entries = fs.readdirSync(postsPath);
  const posts = await Promise.all(
    entries
      .filter((entry) => entry.endsWith(".md"))
      .map((entry) => entry.replace(".md", ""))
      .map((postName) => getPost(postName, { onlyRenderMetadata }))
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

async function generatePostFromMarkdown(
  postId: string | undefined,
  { onlyRenderMetadata }: { onlyRenderMetadata?: boolean } = {}
) {
  const postPath = path.join(__dirname, `../../posts/${postId}.md`);
  if (!fs.existsSync(postPath)) {
    return null;
  }
  if (!postId) {
    return null;
  }
  console.log(`[DEBUG]`, postPath);

  const file = fs.readFileSync(postPath);
  const { html, frontmatter: metadata } = await timeit(
    () => convertMarkdownToHtml(file.toString(), { onlyRenderMetadata }),
    `convertMarkdownToHtml(${postId})`
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
  postId: string | undefined,
  { onlyRenderMetadata = true }: { onlyRenderMetadata?: boolean } = {}
): Promise<PostData | null | undefined> {
  if (!postId) {
    return null;
  }

  let post: PostData | null | undefined;
  if (postCache.has({ id: postId, onlyRenderMetadata })) {
    console.log(`CACHE HIT: ${postId}`);
    post = postCache.get({ id: postId, onlyRenderMetadata });
  } else {
    console.log(`CACHE MISS: ${postId}`);
    post = await timeit(
      () => generatePostFromMarkdown(postId, { onlyRenderMetadata }),
      `generatePostFromMarkdown(${postId})`
    );
    if (post) {
      postCache.set({ id: postId, onlyRenderMetadata }, post);
    }
  }

  return post;
}
