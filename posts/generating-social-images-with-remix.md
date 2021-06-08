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
a link to your website. Adding a social image will help your website to stand out
from others and provide additional information beyond just the title and URL.

The best social images are made by hand and carefully designed
for every piece of content. Unfortunately, that is not practical for a large website
or a site where the pages are dynamically generated. The most practical way is to
dynamically generate social images from metadata.

React applications often have tons of dynamically generated pages, but many frameworks
do not give us the level of control needed to generate social images dynamically,
control caching, and embed them in the page via server-rendered HTML. So, services like [Cloudinary](https://cloudinary.com/)
are often used to fill this role.

But, [Remix](https://remix.run) is not at all like other React frameworks.

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

If you'd like to just copy and paste all of the code for this, I have created a [GitHub Gist](https://gist.github.com/camchenry/0c58cee48bcb0a9d74a412e7e73b4ca9)
with all of the important code.

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

Fortunately, others have already done some of the hard work of writing this code, so I have
adapted [this answer from Stack Overflow](https://stackoverflow.com/a/16599668). Credit to
the original authors there.

```typescript
import { CanvasRenderingContext2D } from "canvas";

// Taken from: https://stackoverflow.com/a/16599668
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

If you'd like to position the title elsewhere, you can change the `x` and `y` properties inside the call to `map`.

### Drawing the Author

Finally, many sites have authors associated with social images, so we will draw the author's name as well as their
profile image in the social image.

```typescript
import { loadImage, NodeCanvasRenderingContext2D } from "canvas";

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
  // ...

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

  // ...
};
```

First, we calculate some positioning numbers that we will use to draw the author's image and name. Then,
if there was a profile image displayed, we the load the image from the given path using `loadImage` and render
it using `ctx.drawImage`.

Finally, we can render the author's name right next to the profile image:

```typescript
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
  // ...

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

  // ...
};
```

If a profile image is passed in, then we position the author's name more to the right, so that there is enough
room to draw the profile image. Otherwise, we use the same text drawing call that we used for drawing the title,
except this time there is no wrapping.

To see the full code for this article, check out the [GitHub Gist](https://gist.github.com/camchenry/0c58cee48bcb0a9d74a412e7e73b4ca9).

## Creating Social Images from Remix

OK, now that we've figured out how to generate images, the most complex part is over. Now we need to
integrate it with Remix, which is the fun part 😊.

Recall from earlier in this post, I said that Remix gives us complete control of the endpoints in our application. The
way that we can integrate our social image generation function is via a custom endpoint in our server code, which should
be located in `app/entry.server.tsx` (if you are using a standard Remix template).

Inside of `entry.server.tsx` there is a `handleRequest` function which lets us return _anything_ we want _whenever_. By
default it will look something like this:

```typescript
export default async function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext
) {
  const markup = ReactDOMServer.renderToString(
    <RemixServer context={remixContext} url={request.url} />
  );

  return new Response("<!DOCTYPE html>" + markup, {
    status: responseStatusCode,
    headers: {
      ...Object.fromEntries(responseHeaders),
      "Content-Type": "text/html",
    },
  });
}
```

We are going to insert some code _before we render the DOM_, to see if we should generate an image instead. To make this
check easier, my social image function endpoint is going to exist at the root of my app under `/social-image`.

```typescript
export default async function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext
) {
  const url = new URL(request.url);
  if (url.pathname.startsWith("/social-image")) {
    // TODO: Generate the image!
  }

  const markup = ReactDOMServer.renderToString(
    <RemixServer context={remixContext} url={request.url} />
  );

  return new Response("<!DOCTYPE html>" + markup, {
    status: responseStatusCode,
    headers: {
      ...Object.fromEntries(responseHeaders),
      "Content-Type": "text/html",
    },
  });
}
```

To generate our image, we just need to the call `generateImage` with some data relevant to the requested URL and
then return a response containing that image.

```typescript
const url = new URL(request.url);
if (url.pathname.startsWith("/social-image")) {
  const socialImage = await generateImage({
    title: "Generating Social Images with Remix",
    author: "Cameron McHenry",
    profileImage: "assets/images/camchenry.png",
  });
  return new Response(socialImage, {
    headers: {
      ...Object.fromEntries(responseHeaders),
      "Content-Type": "image/png",
    },
  });
}
```

Now if we run `npm run dev` and go to `http://localhost:3000/social-image`, we should see our image in the browser! 🎉

### Changing Fonts

TODO: how to register fonts
TODO: where assets / fonts are stored relative to app

### Note for Vercel Users

TODO: how to add assets
TODO: installing correct canvas@2.6.1
TODO: running libuuid install
