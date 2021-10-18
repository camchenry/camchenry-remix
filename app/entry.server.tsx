import ReactDOMServer from "react-dom/server";
import type { EntryContext } from "remix";
import { RemixServer } from "remix";
import {
  createCanvas,
  loadImage,
  CanvasRenderingContext2D,
  registerFont,
} from "canvas";
import { getPost, getPosts } from "./services/posts";
import globby from "globby";
import { generateSitemap } from "./services/sitemap";
import { generateRss } from "./services/rss";

const getLines = (
  ctx: CanvasRenderingContext2D,
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

  const primaryColor = "#6ee7b7";

  // Calculate font sizes and metrics
  ctx.font = `bold ${fontSize}px ${font}`;
  const titleLines = getLines(ctx, title, width - margin * 2);
  const lineHeight = fontSize * 1.2;
  const textHeight = titleLines.length * lineHeight;

  ctx.save();
  // Draw a border around the image with width 5% of the width of the image
  ctx.lineWidth = width * 0.04;
  ctx.strokeStyle = primaryColor;
  ctx.strokeRect(0, 0, width, height);
  ctx.restore();

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
  // Height of the author name text, used for vertically centering with image
  const authorNameHeight = ctx.measureText(author).actualBoundingBoxAscent;

  // Draw the author's profile picture
  if (profileImage) {
    const img = await loadImage(profileImage);
    const x = margin;
    const y = bottomOfTitleText - profileRadius / 2;
    ctx.drawImage(img, x, y, profileRadius, profileRadius);
  }

  // Draw the author's name
  const authorNameImageSpacing = 25;
  const authorNamePosition = {
    x:
      profileImage === undefined
        ? margin
        : margin + profileRadius + authorNameImageSpacing,
    y: bottomOfTitleText + authorNameHeight / 2,
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
    registerFont("assets/fonts/Inter-Regular.otf", {
      family: "Inter",
      weight: "400",
    });
    registerFont("assets/fonts/Inter-Bold.otf", {
      family: "Inter",
      weight: "700",
    });

    const socialImage = await generateImage({
      title: post.metadata.title,
      author: "Cameron McHenry",
      font: "Inter",
      profileImage: "assets/images/camchenry.png",
    });
    return new Response(socialImage, {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=2419200",
      },
    });
  }

  if (url.pathname.startsWith("/sitemap.xml")) {
    const getDate = new Date().toISOString();

    const staticPages = (
      await globby([
        // include
        "./app/routes/**/*.tsx",
        "./app/routes/*.tsx",
        // exclude
        "!./app/routes/**/$*", // skips dynamic routes
        "!./app/routes/404.tsx",
      ])
    ).map((path) => {
      return {
        url: path,
        lastmod: getDate,
      };
    });

    const dynamicPages = [
      ...(await getPosts()).map((post) => {
        return {
          url: `blog/${post.id}`,
          lastmod: new Date(post.metadata.publishedAt).toISOString(),
        };
      }),
    ];

    const pages = [...staticPages, ...dynamicPages];

    const formattedPages = pages.map(({ ...page }) => {
      return {
        ...page,
        url: page.url
          .replace("./app/routes/", "")
          .replace(".tsx", "")
          .replace(/\/index/g, ""),
      };
    });

    const generatedSitemap = generateSitemap(formattedPages, {
      hostname: "https://camchenry.com",
    });

    return new Response(generatedSitemap, {
      headers: {
        "Content-Type": "application/xml",
        "Cache-Control": "public, max-age=2419200",
      },
    });
  }

  if (url.pathname.startsWith("/rss.xml")) {
    const posts = await getPosts();
    const feed = generateRss({
      title: "Cameron McHenry Blog",
      description: "Cameron McHenry's Blog",
      link: "https://camchenry.com/blog",
      entries: posts.map((post) => ({
        description: post.metadata.summary,
        pubDate: new Date(post.metadata.publishedAt).toUTCString(),
        title: post.metadata.title,
        link: `https://camchenry.com/blog/${post.id}`,
        guid: `https://camchenry.com/blog/${post.id}`,
      })),
    });
    return new Response(feed, {
      headers: {
        "Content-Type": "application/xml",
        "Cache-Control": "public, max-age=2419200",
      },
    });
  }

  const markup = ReactDOMServer.renderToString(
    <RemixServer context={remixContext} url={request.url} />
  );

  return new Response("<!DOCTYPE html>" + markup, {
    status: responseStatusCode,
    headers: {
      "Cache-Control":
        "public, max-age=600, s-maxage=31536000, stale-while-revalidate=86400",
      ...Object.fromEntries(responseHeaders),
      "Content-Type": "text/html",
    },
  });
}
