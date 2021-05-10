import React from "react";
import { LoaderFunction, useRouteData } from "remix";
import PostCard from "../../components/PostCard";
import { H2 } from "../../components/styled";
import { getPosts, PostData } from "../../services/posts";

export const loader: LoaderFunction = async () => {
  const posts = getPosts();
  return posts;
};

export default function BlogPostIndex() {
  const posts = useRouteData<PostData[]>();
  return (
    <div>
      <H2 className="mb-4">Posts</H2>
      <ul className="flex flex-col space-y-4">
        {posts.map((post) => (
          <li>
            <PostCard
              id={post.id}
              title={post.metadata.title}
              summary={post.metadata.summary}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
