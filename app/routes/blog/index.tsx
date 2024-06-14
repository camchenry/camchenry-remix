import React from "react";
import { LoaderFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import PageCard from "../../components/PageCard";
import { H1, H2 } from "../../components/styled";
import { getPosts, PostData } from "../../services/posts.server";

type LoaderData = {
  posts: PostData[];
  tils: PostData[];
  tags: string[];
};

export const loader: LoaderFunction = async (): Promise<LoaderData> => {
  const allPosts = await getPosts();
  const tils = allPosts.filter((post) => post.metadata.type === "til");
  const posts = allPosts.filter((post) => post.metadata.type !== "til");
  const tags = Array.from(
    new Set(posts.flatMap((post) => post.metadata.tags ?? []))
  );
  return { posts, tags, tils };
};

export default function BlogPostIndex() {
  const { posts, tags, tils } = useLoaderData<LoaderData>();
  return (
    <div>
      <H1 className="mb-4">Blog</H1>
      <section className="post-section">
        <H2>Posts</H2>
        <ul className="post-grid">
          {posts.map((post) => (
            <li key={post.id}>
              <PageCard
                url={`/blog/${post.id}`}
                title={post.metadata.title}
                summary={post.metadata.summary}
                date={post.metadata.publishedAt}
              />
            </li>
          ))}
        </ul>
      </section>
      <section className="post-section">
        <H2>Today I Learned (TIL)</H2>
        <p className="max-w-prose text-lg py-4">
          Today I learned posts are short posts about something I learned that
          recently.
        </p>
        <ul className="post-grid">
          {tils.map((post) => (
            <li key={post.id}>
              <PageCard
                url={`/blog/${post.id}`}
                title={post.metadata.title}
                summary={post.metadata.summary}
                date={post.metadata.publishedAt}
              />
            </li>
          ))}
        </ul>
      </section>
      <section className="post-section">
        <H2>Tags</H2>
        <ul className="post-grid py-5">
          {tags.map((tag) => (
            <li key={tag}>
              <Link to={`tag/${tag}`}>{tag}</Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
