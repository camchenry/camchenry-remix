import React from "react";
import { LoaderFunction, useRouteData } from "remix";
import PostCard from "../../components/PostCard";
import { H1 } from "../../components/styled";
import { getPosts, PostData } from "../../services/posts";

export const loader: LoaderFunction = async () => {
  const posts = getPosts();
  return posts;
};

export default function BlogPostIndex() {
  const posts = useRouteData<PostData[]>();
  return (
    <div className="max-w-prose mx-auto my-4 lg:my-16">
      <H1 className="mb-4">Posts</H1>
      <ul className="flex flex-col space-y-4">
        {posts.map((post) => (
          <li key={post.id}>
            <PostCard
              id={post.id}
              title={post.metadata.title}
              summary={post.metadata.summary}
              date={post.metadata.publishedAt}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
