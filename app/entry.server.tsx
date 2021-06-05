import ReactDOMServer from "react-dom/server";
import type { EntryContext } from "remix";
import { RemixServer } from "remix";
import {
  createCanvas,
  NodeCanvasRenderingContext2D,
  registerFont,
} from "canvas";
import { getPost } from "./services/posts";

const getLines = (
  ctx: NodeCanvasRenderingContext2D,
  text: string,
  maxWidth: number
) => {
  var words = text.split(" ");
  var lines = [];
  var currentLine = words[0];

  for (var i = 1; i < words.length; i++) {
    var word = words[i];
    var width = ctx.measureText(currentLine + " " + word).width;
    if (width < maxWidth) {
      currentLine += " " + word;
    } else {
      lines.push(currentLine);
      currentLine = word;
    }
  }
  lines.push(currentLine);
  return lines;
};

type GenerateSocialImage = {
  title: string;
  width?: number;
  height?: number;
  fontSize?: number;
  margin?: number;
};
const generateImage = ({
  title,
  width = 1200,
  height = 630,
  fontSize = 64,
  margin = 60,
}: GenerateSocialImage) => {
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext("2d");

  ctx.font = `${fontSize}px Inter`;

  const text =
    "The Ultimate Blog Post About Quintessential Random Topics for Long Titles";
  const lines = getLines(ctx, text, width - margin * 2);
  const lineHeight = fontSize * 1.2;
  const textHeight = lines.length * lineHeight;

  const bottomOfTitleText = height / 2 + textHeight / 2;

  // Draw title text
  lines
    .map((line, index) => ({
      text: line,
      x: margin,
      y: (height - textHeight) / 2 + index * lineHeight,
    }))
    .forEach(({ text, x, y }) => {
      ctx.fillText(text, x, y);
    });

  ctx.font = "";
  ctx.fillText("Cameron McHenry", margin, bottomOfTitleText + 25);

  const png = canvas.toBuffer("image/png");
  return png;
};

export default async function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext
) {
  const markup = ReactDOMServer.renderToString(
    <RemixServer context={remixContext} url={request.url} />
  );

  const url = new URL(request.url);
  if (url.pathname.startsWith("/social-image")) {
    const id = url.searchParams.get("id");
    if (!id) {
      return new Response("", { status: 404 });
    }
    const post = await getPost(id);
    if (!post) {
      return new Response("", { status: 404 });
    }
    registerFont("fonts/Inter-Regular.ttf", { family: "Inter" });
    return new Response(generateImage({ title: post.metadata.title }), {
      status: responseStatusCode,
      headers: {
        ...Object.fromEntries(responseHeaders),
        "Content-Type": "image/png",
      },
    });
  }

  return new Response("<!DOCTYPE html>" + markup, {
    status: responseStatusCode,
    headers: {
      ...Object.fromEntries(responseHeaders),
      "Content-Type": "text/html",
    },
  });
}
