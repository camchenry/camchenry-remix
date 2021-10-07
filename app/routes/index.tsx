import React from "react";
import type { LinksFunction, LoaderFunction, MetaFunction } from "remix";
import { useRouteData } from "remix";
import tw from "tailwind-styled-components";
import PageCard from "../components/PageCard";
import { H1, H2 } from "../components/styled";
import { defaultMeta } from "../meta";
import { getPosts, PostData } from "../services/posts";
import stylesUrl from "../styles/routes/index.css";

export const meta: MetaFunction = () => {
  return defaultMeta;
};

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: stylesUrl }];
};

const getMessage = (messageId: string | null): string | undefined => {
  if (messageId === "confirm-email-subscription") {
    return "Your subscription has been confirmed. Thanks for subscribing!";
  }
};

type LoaderData = {
  posts: PostData[];
  message?: string;
};

export const loader: LoaderFunction = async ({
  request,
}): Promise<LoaderData> => {
  const posts = await getPosts();
  const messageId = new URL(request.url).searchParams.get("messageId");
  const message = getMessage(messageId);
  return { posts, message };
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
  const { posts, message } = useRouteData<LoaderData>();
  return (
    <div className="mb-10">
      {message !== undefined && (
        <div className="text-center bg-gradient-to-r from-green-400 to-green-600 rounded px-4 py-8 mb-4 text-xl text-white">
          {message}
        </div>
      )}
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
      </div>
    </div>
  );
}
