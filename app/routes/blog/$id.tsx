import React from "react";
import {
  HeadersFunction,
  json,
  LinksFunction,
  LoaderFunction,
  MetaFunction,
  redirect,
  useLoaderData,
} from "remix";
import highlightStyles from "../../../node_modules/highlight.js/styles/night-owl.css";
import PostDate from "../../components/PostDate";
import { H1, Hr } from "../../components/styled";
import { defaultMeta, generateMeta } from "../../meta";
import { getPost, PostData } from "../../services/posts";
import styles from "../../styles/routes/blog/post.css";

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
    title: data?.metadata?.title ?? defaultMeta.title,
    description: data?.metadata?.summary ?? defaultMeta.description,
    image: `https://camchenry.com/social-image?id=${data.id}`,
    canonicalUrl: `https://camchenry.com/blog/${data.id}`,
    isArticle: true,
  });
};

export const loader: LoaderFunction = async ({ params }) => {
  const postId = params.id;
  const postData = await getPost(postId);
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
        {data.metadata.tags && (
          <div className="md:text-center">
            {data.metadata.tags.map((tag) => (
              <a
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
