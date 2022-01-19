import ReactDOMServer from "react-dom/server";
import { EntryContext, redirect as remixRedirect } from "remix";
import { RemixServer } from "remix";
import {
  createCanvas,
  SKRSContext2D,
  GlobalFonts,
  Image,
} from "@napi-rs/canvas";
import { getPost, getPosts } from "./services/posts";
import globby from "globby";
import { generateSitemap } from "./services/sitemap";
import { generateRss } from "./services/rss";
import path from "./path";
import fs from "./fs";

const getLines = (ctx: SKRSContext2D, text: string, maxWidth: number) => {
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
    // Load profile image from path
    const data = fs.readFileSync(path.resolve(profileImage));
    const img = new Image(100, 100);
    img.src = data;
    // const img = await loadImage(profileImage);
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

function typedBoolean<T>(
  value: T
): value is Exclude<T, "" | 0 | false | null | undefined> {
  return Boolean(value);
}

type Redirect = {
  methods: string[];
  from: string;
  toUrl: URL;
};

const handleRedirect = (
  req: Request,
  redirects: Redirect[]
): Response | undefined => {
  for (const redirect of redirects) {
    try {
      if (
        !redirect.methods.includes("*") &&
        !redirect.methods.includes(req.method)
      ) {
        continue;
      }
      const url = new URL(req.url);

      console.log(redirect.from, url.pathname);
      const match = url.pathname.match(redirect.from);
      if (!match) continue;

      const toUrl = redirect.toUrl;

      toUrl.protocol = url.protocol;
      if (toUrl.host === "same_host") toUrl.host = url.host;

      for (const [key, value] of url.searchParams.entries()) {
        toUrl.searchParams.append(key, value);
      }
      return remixRedirect(toUrl.toString());
    } catch (error: unknown) {
      // an error in the redirect shouldn't stop the request from going through
      console.error(`Error processing redirects:`, {
        error,
        redirect,
        "req.url": req.url,
      });
    }
  }
};

const getPossibleRedirects = (redirectFile: string): Redirect[] => {
  const possibleMethods = [
    "HEAD",
    "GET",
    "POST",
    "PUT",
    "DELETE",
    "PATCH",
    "*",
  ];
  const redirectsString = fs.readFileSync(redirectFile, "utf8");
  const redirects = redirectsString
    .split("\n")
    .map((line, lineNumber) => {
      if (!line.trim() || line.startsWith("#")) return null;

      let methods, from, to;
      const [one, two, three] = line
        .split(" ")
        .map((l) => l.trim())
        .filter(Boolean);
      if (!one) return null;

      const splitOne = one.split(",");
      if (possibleMethods.some((m) => splitOne.includes(m))) {
        methods = splitOne;
        from = two;
        to = three;
      } else {
        methods = ["*"];
        from = one;
        to = two;
      }

      if (!from || !to) {
        console.error(`Invalid redirect on line ${lineNumber + 1}: "${line}"`);
        return null;
      }

      const toUrl = to.includes("//")
        ? new URL(to)
        : new URL(`https://same_host${to}`);
      try {
        return {
          methods,
          // TODO: Use pathToRegexp here to support regex-based redirects
          from,
          toUrl,
        };
      } catch (error: unknown) {
        // if parsing the redirect fails, we'll warn, but we won't crash
        console.error(
          `Failed to parse redirect on line ${lineNumber}: "${line}"`
        );
        return null;
      }
    })
    .filter(typedBoolean);

  return redirects;
};

export default async function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext
) {
  if (responseStatusCode === 404) {
    // Before returning a true 404 response page, try to check if there is a matching redirect

    const redirects = getPossibleRedirects("./_redirects");
    const redirectResponse = handleRedirect(request, redirects);
    if (redirectResponse) {
      return redirectResponse;
    }
  }

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

    const inter = GlobalFonts.families.some((f) => f.family === "Inter");
    if (!inter) {
      GlobalFonts.registerFromPath(
        path.join(
          __dirname,
          "..",
          "..",
          "assets",
          "fonts",
          "Inter-Regular.otf"
        ),
        "Inter"
      );
      GlobalFonts.registerFromPath(
        path.join(__dirname, "..", "..", "assets", "fonts", "Inter-Bold.otf"),
        "Inter Bold"
      );
    }

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
