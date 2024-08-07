import React from "react";
import { LinksFunction, LoaderFunction, MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import tw from "tailwind-styled-components";
import PageCard from "../components/PageCard";
import { H1, H2 } from "../components/styled";
import { defaultMeta } from "../meta";
import { getPosts, PostData } from "../services/posts.server";
import stylesUrl from "../styles/routes/index.css";

export const meta: MetaFunction = () => {
  return defaultMeta;
};

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: stylesUrl }];
};

type LoaderData = {
  posts: PostData[];
  recentPosts: PostData[];
};

export const loader: LoaderFunction = async (): Promise<LoaderData> => {
  const posts = await getPosts();
  // Only return featured posts
  const featuredIds = [
    "eslint-custom-rules",
    "typescript-type-guards",
    "typescript-union-type",
  ];
  const recentPosts = posts
    .sort(
      (a, b) =>
        new Date(b.metadata.publishedAt).getTime() -
        new Date(a.metadata.publishedAt).getTime()
    )
    .slice(0, 3);
  return {
    posts: posts.filter((post) => featuredIds.includes(post.id)),
    recentPosts,
  };
};

const Intro = tw.section`
  p-4
  md:p-8
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
  border
  border-green-500
  dark:border-green-700
`;

export default function Index() {
  const { posts, recentPosts } = useLoaderData<LoaderData>();
  return (
    <div className="mb-10">
      <Intro id="intro">
        <H1 className="mb-4 py-2 font-black lg:text-5xl text-green-500">
          👋 I'm Cam McHenry
        </H1>
        <div className="my-4">
          <p className="md:text-lg">
            I am a software engineer that is passionate about building great web
            applications. Currently, I work at{" "}
            <a href="https://github.com/camchenry">GitHub</a> and I live in
            State College, Pennsylvania.
          </p>
          <p className="md:text-lg">
            I often write about <a href="/blog/tag/typescript">TypeScript</a>{" "}
            and <a href="/blog/tag/react">React</a> in my blog, and occasionally
            write some useful <a href="/tools">tools</a>.
          </p>
        </div>
        <div id="intro-contact-links" className="md:text-lg my-4">
          <a href="https://twitter.com/cammchenry">Twitter</a>
          <a href="https://github.com/camchenry">GitHub</a>
        </div>
      </Intro>
      <div className="max-w-prose mx-auto">
        <div className="md:text-lg mb-8 lg:mb-24">
          <H2 className="my-4">Featured work</H2>
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
        <div className="md:text-lg">
          <H2 className="my-4">Recent posts</H2>
          <ul className="flex flex-col space-y-4">
            {recentPosts.map((post) => (
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
    </div>
  );
}
