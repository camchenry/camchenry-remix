import { addDays, format } from "date-fns";
import React from "react";

import {
  HeadersFunction,
  json,
  LinksFunction,
  LoaderFunction,
  MetaFunction,
  redirect,
} from "@remix-run/node";

import { useLoaderData } from "@remix-run/react";
import highlightStyles from "../../../node_modules/highlight.js/styles/night-owl.css";
import PostDate from "../../components/PostDate";
import { H1, Hr } from "../../components/styled";
import { defaultMeta, defaultTitle, generateMeta } from "../../meta";
import { getPost, PostData } from "../../services/posts.server";
import styles from "../../styles/routes/blog/post.css";
import { timeit } from "../../services/profiling.server";

export const links: LinksFunction = () => {
  return [
    { rel: "stylesheet", href: highlightStyles },
    { rel: "stylesheet", href: styles },
  ];
};

export const headers: HeadersFunction = ({ loaderHeaders }) => {
  const canonicalUrl = loaderHeaders.get("Link");
  return {
    ...(canonicalUrl && { Link: canonicalUrl }),
  };
};

export const meta: MetaFunction = ({ data }: { data: PostData }) => {
  return generateMeta({
    title: data?.metadata?.title
      ? `${data.metadata.title} | ${defaultTitle}`
      : defaultTitle,
    description: data?.metadata?.summary ?? defaultMeta.description,
    image: `https://camchenry.com/social-image?id=${data.id}`,
    canonicalUrl: `https://camchenry.com/blog/${data.id}`,
    isArticle: true,
  });
};

export const loader: LoaderFunction = async ({ params }) => {
  const postId = params.id;
  const postData = await timeit(
    () => getPost(postId, { onlyRenderMetadata: false }),
    "getPost"
  );
  if (!postData) {
    return redirect("/404");
  }

  return json(
    {
      ...postData,
      canonicalUrl: `https://camchenry.com/blog/${postData.id}`,
    },
    {
      headers: {
        Link: `<https://camchenry.com/blog/${postData.id}>; rel="canonical"`,
      },
    }
  );
};

export default function BlogPost() {
  const data = useLoaderData<PostData>();

  const today = format(new Date(), "yyyy-MM-dd");
  const tomorrow = format(addDays(new Date(), 1), "yyyy-MM-dd");
  const todos = {
    // Always check the title and summary for TODO
    // (since it should be fixed, even if it is published)
    title: data.metadata.title.toLowerCase().includes("todo"),
    summary: data.metadata.summary.toLowerCase().includes("todo"),
    // The date is OK if:
    // - It is published and in the past (or today)
    // - It is not published and anything but today or tomorrow
    // Otherwise, it should be considered in error.
    date: data.metadata.published
      ? new Date(data.metadata.publishedAt) > new Date()
      : data.metadata.publishedAt !== today &&
        data.metadata.publishedAt !== tomorrow,
  };

  return (
    <div>
      <div className="md:my-12 mx-auto max-w-3xl lg:max-w-4xl">
        {data.metadata.type === "til" && (
          <div className="til text-sm md:text-center mb-2">Today I learned</div>
        )}
        <H1
          className="mb-2 font-bold md:mb-4 md:text-4xl md:text-center"
          style={todos.title ? { background: "red" } : undefined}
        >
          {data.metadata.title}
        </H1>
        <div
          className="md:text-center"
          style={todos.date ? { background: "red" } : undefined}
        >
          By Cam McHenry on <PostDate publishedAt={data.metadata.publishedAt} />
          {data.metadata.updatedAt && (
            <span>
              {" "}
              (Updated on <PostDate publishedAt={data.metadata.updatedAt} />)
            </span>
          )}
        </div>
        {data.metadata.tags && (
          <div className="md:text-center">
            {data.metadata.tags.map((tag) => (
              <a
                key={tag}
                className="mr-2 border-b border-green-300"
                href={`/blog/tag/${tag}`}
              >
                #{tag}
              </a>
            ))}
          </div>
        )}
      </div>
      <div className="mx-auto max-w-2xl mb-10">
        <Hr />
        <p
          className="prose dark:prose-invert mx-auto"
          style={todos.summary ? { background: "red" } : undefined}
        >
          <span className="font-bold">Summary</span> ❧ {data.metadata.summary}
        </p>
        <Hr />
        <main
          className="prose dark:prose-invert mx-auto"
          dangerouslySetInnerHTML={{ __html: data.text }}
        />
      </div>
    </div>
  );
}
