import { redirect } from "remix";
import fs from "../fs";
import path from "../path";
import html from "remark-html";
import frontmatter from "remark-frontmatter";
import parseFrontmatter from "remark-parse-frontmatter";
import parse from "remark-parse";
import unified from "unified";
import gfm from "remark-gfm";
import highlight from "remark-highlight.js";

export type PostMetadata = {
  title: string;
  summary: string;
  publishedAt: string;
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
    typeof casted.publishedAt === "string"
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
  const postsPath = path.join(__dirname, `../posts`);
  const entries = fs.readdirSync(postsPath);
  const posts = await Promise.all(
    entries
      .filter((entry) => entry.endsWith(".md"))
      .map((entry) => entry.replace(".md", ""))
      .map((postName) => getPost(postName))
      .filter(notNullOrUndefined)
  );
  const filtered = posts.filter(notNullOrUndefined);
  return filtered;
}

export async function getPost(
  postId: string | undefined
): Promise<PostData | null> {
  if (!postId) {
    return null;
  }
  const postPath = path.join(__dirname, `../posts/${postId}.md`);
  if (!fs.existsSync(postPath)) {
    return null;
  }
  const file = fs.readFileSync(postPath);
  const processed = await unified()
    .use(parse)
    .use(frontmatter, ["yaml", "toml"])
    .use(parseFrontmatter)
    .use(gfm)
    .use(html)
    .use(highlight, ["bash"])
    .process(file.toString());
  const metadata = (processed.data as Record<string, unknown> | null)
    ?.frontmatter;
  if (!isPostMetadata(metadata)) {
    throw new Error("Failed to parse post metadata");
  }
  const postData: PostData = {
    text: processed.contents.toString(),
    id: postId,
    metadata,
  };
  if (!isPost(postData)) {
    throw new Error("Failed to parse post");
  }
  return postData;
}
