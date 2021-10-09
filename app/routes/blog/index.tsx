import React from "react";
import { LoaderFunction, useLoaderData } from "remix";
import PageCard from "../../components/PageCard";
import { Container, H1 } from "../../components/styled";
import { getPosts, PostData } from "../../services/posts";

export const loader: LoaderFunction = async () => {
  const posts = getPosts();
  return posts;
};

export default function BlogPostIndex() {
  const posts = useLoaderData<PostData[]>();
  console.log(posts);
  return (
    <Container>
      <H1 className="mb-4">Posts</H1>
      <ul className="flex flex-col space-y-4">
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
    </Container>
  );
}
