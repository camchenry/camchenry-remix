import ReactDOMServer from "react-dom/server";
import type { EntryContext } from "remix";
import { RemixServer } from "remix";
import {
  createCanvas,
  loadImage,
  NodeCanvasRenderingContext2D,
  registerFont,
} from "canvas";
import { getPost } from "./services/posts";
import path from "./path";

const getLines = (
  ctx: NodeCanvasRenderingContext2D,
  text: string,
  maxWidth: number
) => {
  const words = text.split(" ");
  const lines = [];
  let currentLine = words[0];

  for (let i = 1; i < words.length; i++) {
    const word = words[i];
    const width = ctx.measureText(currentLine + " " + word).width;
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
  /**
   * The name of the content.
   */
  title: string;
  /**
   * Author name to display.
   */
  author?: string;
  /**
   * Width of the social image.
   */
  width?: number;
  /**
   * Height of the social image.
   */
  height?: number;
  /**
   * Font size to use for the title and author name.
   */
  fontSize?: number;
  /**
   * How much margin to leave around the edges of the image.
   */
  margin?: number;
  /**
   * Path to the author profile image to display.
   */
  profileImage?: string;
  /**
   * The radius of the author's profile image, if an image is supplied.
   */
  profileRadius?: number;
  /**
   * The font to use for all text in the social image.
   */
  font?: string;
};
const generateImage = async ({
  title,
  width = 1200,
  height = 630,
  fontSize = 80,
  margin = 60,
  profileImage,
  profileRadius = 120,
  author = "Cameron McHenry",
  font,
}: GenerateSocialImage) => {
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext("2d");

  // Draw background gradient
  const gradient = ctx.createLinearGradient(0, width, width, height);
  gradient.addColorStop(0.3, "#6ee7b7");
  gradient.addColorStop(1, "#60A5FA");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  // Calculate font sizes and metrics
  ctx.font = `bold ${fontSize}px ${font}`;
  const titleLines = getLines(ctx, title, width - margin * 2);
  const lineHeight = fontSize * 1.2;
  const textHeight = titleLines.length * lineHeight;

  // Draw title text
  titleLines
    .map((line, index) => ({
      text: line,
      x: margin,
      y: (height - textHeight) / 2 + index * lineHeight,
    }))
    .forEach(({ text, x, y }) => {
      ctx.fillStyle = "#000";
      ctx.fillText(text, x, y);
    });

  // Vertical spacing after the title before drawing the author info
  const spacingAfterTitle = 50;
  // Where to start drawing author info
  const bottomOfTitleText = height / 2 + textHeight / 2 + spacingAfterTitle;

  // Draw the author's profile picture
  if (profileImage) {
    const img = await loadImage(profileImage);
    const x = margin;
    const y = bottomOfTitleText - profileRadius + lineHeight / 2;
    ctx.drawImage(img, x, y, profileRadius, profileRadius);
  }

  // Draw the author's name
  const authorNameImageSpacing = 25;
  const authorNamePosition = {
    x:
      profileImage === undefined
        ? margin + authorNameImageSpacing
        : margin + profileRadius + authorNameImageSpacing,
    y: bottomOfTitleText,
  };
  ctx.font = `${fontSize}px ${font}`;
  ctx.fillText(author, authorNamePosition.x, authorNamePosition.y);

  return canvas.toBuffer("image/png");
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
    registerFont(path.join(__dirname, "../../assets/fonts/Inter-Regular.otf"), {
      family: "Inter",
      weight: "400",
    });
    registerFont(path.join(__dirname, "../../assets/fonts/Inter-Bold.otf"), {
      family: "Inter",
      weight: "700",
    });
    return new Response(
      await generateImage({
        title: post.metadata.title,
        profileImage: "assets/images/camchenry.png",
        font: "Inter",
      }),
      {
        status: 200,
        headers: {
          ...Object.fromEntries(responseHeaders),
          "Content-Type": "image/png",
        },
      }
    );
  }

  return new Response("<!DOCTYPE html>" + markup, {
    status: responseStatusCode,
    headers: {
      ...Object.fromEntries(responseHeaders),
      "Content-Type": "text/html",
    },
  });
}
