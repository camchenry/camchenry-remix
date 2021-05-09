import { LoaderFunction, MetaFunction, redirect, useRouteData } from "remix";
import fs from "../../fs";
import path from "../../path";
import html from "remark-html";
import frontmatter from "remark-frontmatter";
import parseFrontmatter from "remark-parse-frontmatter";
import parse from "remark-parse";
import unified from "unified";
import gfm from "remark-gfm";
import { defaultMeta } from "../../meta";

type PostData = {
  text: string;
  metadata: {
    title: string;
    summary: string;
    publishedAt: string;
  };
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
  const postPath = path.join(__dirname, `../app/posts/${postId}.md`);
  if (!fs.existsSync(postPath)) {
    return redirect("/404");
  }
  const file = fs.readFileSync(postPath);
  const post = await unified()
    .use(parse)
    .use(frontmatter, ["yaml", "toml"])
    .use(parseFrontmatter)
    .use(gfm)
    .use(html)
    .process(file.toString());
  if (typeof post.data !== "object") {
    throw new Error("Failed to parse post data");
  }
  const postData = post.data as Record<string, unknown> | null;
  const meta = postData?.frontmatter;
  if (!meta) {
    throw new Error("Failed to parse post data");
  }
  console.log(post.data);
  return { text: post.contents, metadata: meta } as PostData;
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
