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

const fs = require("fs");
const path = require("path");
const { prompt } = require("enquirer");

// Load post template from `templates/post.md`
const postTemplate = fs.readFileSync(
  path.join(__dirname, "../templates/post.md"),
  "utf8"
);

/** @type {Parameters<typeof prompt>[0]} */
const questions = [
  {
    type: "input",
    name: "title",
    message: "What is the title of the post?",
  },
  {
    type: "input",
    name: "tags",
    message: "What are the tags of the post?",
  },
  {
    type: "select",
    name: "type",
    message: "What is the type of the post?",
    choices: ["post", "guide", "til"],
  },
];

prompt(questions)
  .then((answers) => {
    const title = answers["title"];
    const type = answers["type"];
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9 ]/g, "")
      .replace(/ /g, "-");
    const date = new Date().toISOString().split("T")[0];
    const tags = answers["tags"];
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
  })
  .catch(console.error);
