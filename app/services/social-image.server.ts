import { Image, SKRSContext2D, createCanvas } from "@napi-rs/canvas";
import fs from "../fs";
import path from "../path";

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

export type GenerateSocialImage = {
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
export const generateImage = async ({
  title,
  width = 1200,
  height = 630,
  fontSize = 80,
  margin = 60,
  profileImage,
  profileRadius = 120,
  author = "Cam McHenry",
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
