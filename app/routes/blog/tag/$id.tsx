import { LoaderFunction } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import PageCard from "../../../components/PageCard";
import { Container, H1 } from "../../../components/styled";
import { getPosts, PostData } from "../../../services/posts.server";

type LoaderData = {
  id: string;
  posts: PostData[];
};

export const loader: LoaderFunction = async ({
  params,
}): Promise<LoaderData> => {
  const id: string | undefined = params.id;
  if (!id) {
    throw new Response("", { status: 404 });
  }
  const posts = (await getPosts()).filter((post) =>
    post.metadata.tags?.includes(id)
  );
  if (posts.length === 0) {
    throw new Response("", { status: 404 });
  }
  return { id, posts };
};

export default function Tag() {
  const { id, posts } = useLoaderData<LoaderData>();
  return (
    <Container>
      <div className="my-4 md:my-16">
        <H1 className="font-bold mb-2 md:text-4xl md:text-center">#{id}</H1>
        <div className="md:text-center">
          {posts.length} {posts.length === 1 ? "post" : "posts"}
        </div>
      </div>
      <div>
        <Outlet />
      </div>
      <div>
        {posts.map((post) => (
          <PageCard
            key={post.id}
            summary={post.metadata.summary}
            date={post.metadata.publishedAt}
            title={post.metadata.title}
            url={`/blog/${post.id}`}
          />
        ))}
      </div>
    </Container>
  );
}
