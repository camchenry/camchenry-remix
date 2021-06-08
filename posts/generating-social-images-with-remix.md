---
title: Generating Social Images with Remix
summary: "TODO: Summary"
publishedAt: "9999-01-01"
tags:
  - remix
  - node
  - seo
---

<figure>
  <img src="/social-image?id=generating-social-images-with-remix" alt="Blog post: Generating Social Images with Remix by Cameron McHenry"/>
  <figcaption>The generated social image for this blog post (meta, right?)</figcaption>
</figure>

Social images are an important part of every website's online presence, because it is
typically the first thing that users or customers will see, before they even click on
a link to your website. The best social images are made by hand and carefully designed
for every piece of content. Unfortunately, that is not practically for a large website
or a site where the pages are dynamically generated.

React applications often have tons of dynamically generated pages, but many frameworks
do not give us the level of control needed to generate social images dynamically,
control caching, and embed them in the page via server-rendered HTML.

But, [Remix](https://remix.run) is a different kind of React framework.

## Remix

Remix is a web application framework that gives you full control of the request and response
pipeline, allowing you to write both server-side and client-side code simultaneously. It prerenders React components and serves it as plain HTML, allowing you to create a React application
that potentially doesn't even include React as a client-side dependency!

For our purposes though, the important thing about Remix is that we can embed anything we
want into the initial HTML page. This allows search engines and bots to crawl our websites
and scrape the [Open Graph](https://ogp.me/) image metadata tag.

## Generating Social Images

To generate our social images, we will:

1. Create a [canvas](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API) using the [node-canvas](https://www.npmjs.com/package/canvas) library
2. Draw on it (title, author, profile image, etc.)
3. Convert the canvas to a PNG

To install the canvas library, run:

```bash
npm install canvas
```

Next, let's write a type definition for all of the parameters in our image generation function.

```typescript
type GenerateSocialImage = {
  // The name of the content.
  title: string;
  // Author name to display.
  author?: string;
  // Width of the social image.
  width?: number;
  // Height of the social image.
  height?: number;
  // Font size to use for the title and author name.
  fontSize?: number;
  // How much margin to leave around the edges of the image.
  margin?: number;
  // Path to the author profile image to display.
  profileImage?: string;
  // The radius of the author's profile image, if an image is supplied.
  profileRadius?: number;
  // The font to use for all text in the social image.
  font?: string;
};
```

Now, let's write a very simple image generation function. For these images, we are going
to use dimensions of 1200x630.

```typescript
import { createCanvas } from "canvas";

const generateImage = async ({
  width = 1200,
  height = 630,
}: GenerateSocialImage) => {
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext("2d");

  return canvas.toBuffer("image/png");
};
```

Cool. This function doesn't do much yet, but this is generating a blank 1200x630 canvas,
getting a context for it (for drawing things), then converting it to a PNG image.

### Adding Gradients

Let's add something interesting: background gradients.

```typescript
const generateImage = async (/* ... */) => {
  // ...

  // Draw background gradient
  const gradient = ctx.createLinearGradient(0, width, width, height);
  gradient.addColorStop(0.3, "#6ee7b7");
  gradient.addColorStop(1, "#60A5FA");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  // ...
};
```

In this case, I've chosen the colors that I use for my website and hard-coded them,
but you could easily add these as arguments to this function and supply different values.
Here are some potential cool ideas to try:

- Use different gradient colors for each author
- Generate gradients based on page topic
- Fade colors over time as post gets older relative to current date

### Drawing the Title

Now, let's draw the most important thing: the title. Since titles can be longer
than a few words, we will want to enable word wrapping. However, the canvas API
does not specify word wrapping, so you will have to write your own.

Fortunately, others have already done some of the hard work for us, so I have simply
adapted [an answer from Stack Overflow](https://stackoverflow.com/a/16599668). Credit to
the original authors there.

```typescript
import { NodeCanvasRenderingContext2D } from "canvas";

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
```

Next, let's use the `getLines` function to wrap our title text, then iterate
over the lines and draw the text:

```typescript
const generateImage = async ({
  title,
  width = 1200,
  height = 630,
  fontSize = 80,
  margin = 60,
  font,
}: GenerateSocialImage) => {
  // ...

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

  // ...
};
```

There's a lot of math and other processing going on here, but the gist of it is:

- Set the font, then figure out which text should be wrapped
- Calculate some metrics about the font and text, like line height and the total text height
- For each line, draw it so that it is vertically centered in the image
