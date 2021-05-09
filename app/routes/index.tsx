import type { MetaFunction, LinksFunction, LoaderFunction } from "remix";
import { useRouteData } from "remix";
import { defaultMeta } from "../meta";
import { getPosts, PostData } from "../services/posts";

import stylesUrl from "../styles/index.css";

export const meta: MetaFunction = () => {
  return { ...defaultMeta };
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

export default function Index() {
  const data = useRouteData<RouteData>();
  return (
    <div>
      <h1>Cameron McHenry</h1>
      <p>
        is passionate about building web applications and tools that make the
        world better.
      </p>
      <h2>Posts</h2>
      <ul>
        {data.posts.map((post) => (
          <li>
            <h3>
              <a href={`/blog/${post.id}`}>{post.metadata.title}</a>
            </h3>
            <p>{post.metadata.summary}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
