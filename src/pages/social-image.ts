import type { APIRoute } from "astro";
import { getPost } from "../lib/posts";

export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
  const id = new URL(request.url).searchParams.get("id");
  if (!id || !(await getPost(id))) {
    return new Response("", { status: 404 });
  }

  return new Response("", {
    status: 302,
    headers: {
      Location: `/social-images/${id}.png`,
      "Cache-Control": "public, max-age=2419200",
    },
  });
};