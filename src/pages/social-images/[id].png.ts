import type { APIRoute, GetStaticPaths } from "astro";
import type { CollectionEntry } from "astro:content";
import { getPosts } from "../../lib/posts";
import { generateSocialImage } from "../../lib/social-image";

export const prerender = true;

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = await getPosts();
  return posts.map((post) => ({ params: { id: post.id }, props: { post } }));
};

export const GET: APIRoute = async ({ props }) => {
  const post = props.post as CollectionEntry<"blog">;
  const image = await generateSocialImage(post.data.title);
  return new Response(new Uint8Array(image), {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=2419200",
    },
  });
};