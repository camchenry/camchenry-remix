import { LoaderFunction, MetaFunction, redirect, useRouteData } from "remix";
import { defaultMeta } from "../../meta";
import { getPost, PostData } from "../../services/posts";

import highlightStyles from "../../../node_modules/highlight.js/styles/night-owl.css";
import { LinksFunction } from "remix";

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
    <div>
      <h1>{data.metadata.title}</h1>
      <div>
        By Cameron McHenry on{" "}
        <time>
          {new Date(Date.parse(data.metadata.publishedAt)).toLocaleDateString()}
        </time>
      </div>
      <p>Summary ❧ {data.metadata.summary}</p>
      <hr />
      <main dangerouslySetInnerHTML={{ __html: data.text }} />
    </div>
  );
}
