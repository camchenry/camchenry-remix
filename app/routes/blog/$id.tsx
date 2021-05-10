import { LoaderFunction, MetaFunction, redirect, useRouteData } from "remix";
import { defaultMeta } from "../../meta";
import { getPost, PostData } from "../../services/posts";

import highlightStyles from "../../../node_modules/highlight.js/styles/night-owl.css";
import { LinksFunction } from "remix";
import React from "react";
import { H1 } from "../../components/styled";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: highlightStyles }];
};

export const meta: MetaFunction = ({ data }) => {
  return {
    ...defaultMeta,
    title: data?.metadata?.title ?? defaultMeta.title,
    description: data?.metadata?.summary ?? defaultMeta.description,
  };
};

export const loader: LoaderFunction = async ({ params }) => {
  const postId: string = params.id;
  const postData = await getPost(postId);
  if (!postData) {
    return redirect("/404");
  }
  return postData;
};

export default function BlogPost() {
  const data = useRouteData<PostData>();
  console.log(data);

  return (
    <div className="mx-auto max-w-2xl">
      <H1 className="mb-2 md:mb-4 md:text-4xl md:text-center">
        {data.metadata.title}
      </H1>
      <div className="mb-4 md:text-center">
        By Cameron McHenry on{" "}
        <time>
          {new Date(Date.parse(data.metadata.publishedAt)).toLocaleDateString()}
        </time>
      </div>
      <hr className="my-4" />
      <p className="prose mx-auto">
        <span className="font-bold">Summary</span> ❧ {data.metadata.summary}
      </p>
      <hr className="my-4" />
      <main
        className="prose mx-auto"
        dangerouslySetInnerHTML={{ __html: data.text }}
      />
    </div>
  );
}
