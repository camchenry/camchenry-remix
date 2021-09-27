import React from "react";
import type { MetaFunction, LinksFunction, LoaderFunction } from "remix";
import { useRouteData } from "remix";
import tw from "tailwind-styled-components";
import PageCard from "../components/PageCard";
import { H1, H2, H3 } from "../components/styled";
import { defaultMeta } from "../meta";
import { getPosts, PostData } from "../services/posts";

import stylesUrl from "../styles/routes/index.css";

export const meta: MetaFunction = () => {
  return defaultMeta;
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

const Header = tw.header`
  lg:text-center
  p-6
  lg:p-16
  mb-8
  mx-auto
  lg:my-16
  lg:mb-24
  flex
  flex-col
  align-center
  justify-center
  max-w-3xl
  rounded
  rounded-lg
  shadow-md
  lg:shadow-2xl
`;

export default function Index() {
  const data = useRouteData<RouteData>();
  return (
    <div className="mb-10">
      <Header>
        <H1 className="mb-4 py-2  font-black lg:text-5xl bg-gradient-to-r from-green-400 to-green-600">
          Cameron McHenry
        </H1>
        <p className="text-white-500 text-lg filter">
          is passionate about building web applications and tools
          <br />
          that make the world better.
        </p>
      </Header>
      <div className="max-w-prose mx-auto">
        <H2 className="mb-4">Posts</H2>
        <ul className="flex flex-col space-y-4">
          {data.posts.map((post) => (
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
      </div>
    </div>
  );
}
