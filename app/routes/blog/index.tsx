import { LoaderFunction, useRouteData } from "remix";
import { getPosts, PostData } from "../../services/posts";

export const loader: LoaderFunction = async () => {
  const posts = getPosts();
  return posts;
};

export default function BlogPostIndex() {
  const posts = useRouteData<PostData[]>();
  return (
    <div>
      <h2>Posts</h2>
      <ul>
        {posts.map((post) => (
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
