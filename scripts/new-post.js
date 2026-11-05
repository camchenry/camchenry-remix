// @ts-check
/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
// Script for creating a new post based on the post template,
// and also setting information about the post, like:
// - title / slug
// - date
// - tags
// - type
//   - "post" (default) - general blog post
//   - "guide"
//   - "til"

const fs = require("node:fs");
const path = require("node:path");
const { createInterface } = require("node:readline/promises");

// Load post template from `templates/post.md`
const postTemplate = fs.readFileSync(
  path.join(__dirname, "../templates/post.md"),
  "utf8"
);

async function main() {
  const prompt = createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  const controller = new AbortController();
  prompt.once("close", () => controller.abort());
  const options = { signal: controller.signal };

  try {
    const title = await prompt.question("What is the title of the post? ", options);
    const tags = await prompt.question("What are the tags of the post? ", options);
    const postTypes = ["post", "guide", "til"];
    let type = "";
    do {
      type =
        (await prompt.question(
          "What is the type of the post? (post/guide/til) [post]: ",
          options
        )).trim() || "post";
      if (!postTypes.includes(type)) {
        console.error("Please choose post, guide, or til.");
      }
    } while (!postTypes.includes(type));

    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9 ]/g, "")
      .replace(/ /g, "-");
    const date = new Date().toISOString().split("T")[0];
    const tagsList =
      "\n" +
      tags
        .split(",")
        .map((tag) => `  - ${tag.trim()}`)
        .join("\n");
    const post = postTemplate
      .replace(/\{\{title\}\}/g, title)
      .replace(/\{\{date\}\}/g, date)
      .replace(/TAGS/g, tagsList)
      .replace(/TYPE/g, type);

    const postPath = path.join(__dirname, "..", "posts", `${slug}.md`);
    fs.writeFileSync(postPath, post);
  } finally {
    prompt.close();
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
