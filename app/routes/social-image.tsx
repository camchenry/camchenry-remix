import { LoaderFunction } from "@remix-run/node";
import { getPost } from "../services/posts.server";
import { GlobalFonts } from "@napi-rs/canvas";
import path from "../path";
import { generateImage } from "../services/social-image.server";

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);

  const id = url.searchParams.get("id");
  if (!id) {
    return new Response("", { status: 404 });
  }
  const post = await getPost(id, { onlyRenderMetadata: true });
  if (!post) {
    return new Response("", { status: 404 });
  }

  const inter = GlobalFonts.families.some((f) => f.family === "Inter");
  if (!inter) {
    GlobalFonts.registerFromPath(
      path.join(__dirname, "..", "..", "assets", "fonts", "Inter-Regular.otf"),
      "Inter"
    );
    GlobalFonts.registerFromPath(
      path.join(__dirname, "..", "..", "assets", "fonts", "Inter-Bold.otf"),
      "Inter Bold"
    );
  }

  const socialImage = await generateImage({
    title: post.metadata.title,
    author: "Cam McHenry",
    font: "Inter",
    profileImage: "assets/images/camchenry.png",
  });
  return new Response(socialImage, {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=2419200",
    },
  });
};
