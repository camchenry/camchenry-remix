import React from "react";
import type { MetaFunction, LinksFunction, LoaderFunction } from "remix";
import { useRouteData } from "remix";
import PostCard from "../components/PostCard";
import { H1, H2, H3 } from "../components/styled";
import { defaultMeta } from "../meta";
import { getPosts, PostData } from "../services/posts";

import stylesUrl from "../styles/routes/index.css";

export const meta: MetaFunction = () => {
  return { ...defaultMeta };
};

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: stylesUrl }];
};

export const loader: LoaderFunction = async () => {
  const posts = await getPosts();
  return { posts };
};

type RouteData = {
  posts: PostData[];
};

export default function Index() {
  const data = useRouteData<RouteData>();
  return (
    <div>
      <div className="text-center mb-8">
        <H1 className="mb-4">Cameron McHenry</H1>
        <p className="text-gray-700">
          is passionate about building web applications and tools that make the
          world better.
        </p>
      </div>
      <H2 className="mb-4">Posts</H2>
      <ul className="flex flex-col space-y-4">
        {data.posts.map((post) => (
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
