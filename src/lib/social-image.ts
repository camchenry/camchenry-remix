import {
  createCanvas,
  GlobalFonts,
  Image,
  type SKRSContext2D,
} from "@napi-rs/canvas";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const regularFont = resolve("src/assets/fonts/Inter-Regular.otf");
const boldFont = resolve("src/assets/fonts/Inter-Bold.otf");
const profileImage = resolve("src/assets/images/camchenry.png");

function getLines(ctx: SKRSContext2D, text: string, maxWidth: number) {
  const words = text.split(" ");
  const lines: string[] = [];
  let currentLine = words[0] ?? "";

  for (const word of words.slice(1)) {
    const width = ctx.measureText(`${currentLine} ${word}`).width;
    if (width < maxWidth) {
      currentLine += ` ${word}`;
    } else {
      lines.push(currentLine);
      currentLine = word;
    }
  }
  lines.push(currentLine);
  return lines;
}

export async function generateSocialImage(title: string) {
  if (!GlobalFonts.families.some(({ family }) => family === "Inter")) {
    GlobalFonts.registerFromPath(regularFont, "Inter");
    GlobalFonts.registerFromPath(boldFont, "Inter Bold");
  }

  const width = 1200;
  const height = 630;
  const fontSize = 80;
  const margin = 60;
  const profileRadius = 120;
  const author = "Cam McHenry";
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext("2d");

  ctx.font = `bold ${fontSize}px Inter`;
  const titleLines = getLines(ctx, title, width - margin * 2);
  const lineHeight = titleLines.length >= 4 ? fontSize : fontSize * 1.2;
  const textHeight = titleLines.length * lineHeight;

  ctx.save();
  ctx.lineWidth = width * 0.04;
  ctx.strokeStyle = "#0fb880";
  ctx.strokeRect(0, 0, width, height);
  ctx.restore();

  titleLines.forEach((text, index) => {
    ctx.fillStyle = "#000";
    ctx.fillText(text, margin, (height - textHeight) / 2 + index * lineHeight);
  });

  const bottomOfTitleText = height / 2 + textHeight / 2 + 50;
  const authorNameHeight = ctx.measureText(author).actualBoundingBoxAscent;
  const image = new Image(100, 100);
  image.src = readFileSync(profileImage);
  ctx.drawImage(
    image,
    margin,
    bottomOfTitleText - profileRadius / 2,
    profileRadius,
    profileRadius,
  );

  ctx.font = `${fontSize}px Inter`;
  ctx.fillText(
    author,
    margin + profileRadius + 25,
    bottomOfTitleText + authorNameHeight / 2,
  );

  return canvas.toBuffer("image/png");
}
