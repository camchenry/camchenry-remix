import React from "react";
import {
  LinksFunction,
  LoaderFunction,
  MetaFunction,
  useLoaderData,
} from "remix";
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
  shadow-md
  lg:shadow-2xl
`;

export default function Index() {
  const { posts, message } = useLoaderData<LoaderData>();
  return (
    <div className="mb-10">
      {message !== undefined && (
        <div className="text-center bg-gradient-to-r from-green-400 to-green-600 rounded px-4 py-8 mb-4 text-xl text-white">
          {message}
        </div>
      )}
      <Intro id="intro">
        <H1 className="mb-4 py-2 font-black lg:text-5xl bg-gradient-to-r from-green-400 to-green-600">
          I'm Cameron McHenry
        </H1>
        <div className="my-4">
          <p className="md:text-lg">
            I am a software engineer that is passionate about building great web
            applications. Currently, I work at{" "}
            <a href="https://github.com/camchenry">GitHub</a>.
          </p>
          <p className="md:text-lg">
            I often write about <a href="/blog/tag/typescript">TypeScript</a>{" "}
            and <a href="/blog/tag/react">React</a> in my blog, and occasionally
            write some useful <a href="/tools">tools</a>.
          </p>
        </div>
        <div className="md:text-lg">
          <H2 className="my-4">Featured work</H2>
          <ul className="my-4">
            <li>
              🔥 A story about{" "}
              <a href="/blog/how-serverless-saved-my-heating-bill">
                How Serverless Saved Money on My Heating Bill
              </a>
            </li>
            <li>
              🤖 An answer on{" "}
              <a href="/blog/github-copilot">
                Why I'm Not Worried About GitHub Copilot Taking My Software Job
              </a>
            </li>
            <li>
              🛠 Learn everything there is to know about TypeScript type guards
              in{" "}
              <a href="/blog/typescript-type-guards">
                How To Do Anything in TypeScript With Type Guards
              </a>
            </li>
          </ul>
        </div>
        <div id="intro-contact-links" className="md:text-lg my-4">
          <a href="https://twitter.com/cammchenry">Twitter</a>
          <a href="https://github.com/camchenry">GitHub</a>
          <a href="https://camchenry.ck.page/mailing-list">Newsletter</a>
        </div>
      </Intro>
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
