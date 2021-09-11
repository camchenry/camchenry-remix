import { LoaderFunction, MetaFunction, redirect, useRouteData } from "remix";
import { defaultMeta, generateMeta } from "../../meta";
import { getPost, PostData } from "../../services/posts";

import highlightStyles from "../../../node_modules/highlight.js/styles/night-owl.css";
import { LinksFunction } from "remix";
import React from "react";
import { H1, Hr } from "../../components/styled";
import { format, zonedTimeToUtc } from "date-fns-tz";
import PostDate from "../../components/PostDate";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: highlightStyles }];
};

export const meta: MetaFunction = ({ data }: { data: PostData }) => {
  return generateMeta({
    title: data?.metadata?.title ?? defaultMeta.title,
    description: data?.metadata?.summary ?? defaultMeta.description,
    image: `https://camchenry.com/social-image?id=${data.id}`,
  });
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

  return (
    <div>
      <div className="md:my-12 mx-auto max-w-3xl lg:max-w-4xl">
        <H1 className="mb-2 font-bold md:mb-4 md:text-4xl md:text-center">
          {data.metadata.title}
        </H1>
        <div className="mb-4 md:text-center">
          By Cameron McHenry on{" "}
          <PostDate publishedAt={data.metadata.publishedAt} />
        </div>
      </div>
      <div className="mx-auto max-w-2xl mb-10">
        <Hr />
        <p className="prose mx-auto">
          <span className="font-bold">Summary</span> ❧ {data.metadata.summary}
        </p>
        <Hr />
        <main
          className="prose mx-auto"
          dangerouslySetInnerHTML={{ __html: data.text }}
        />
      </div>
    </div>
  );
}
