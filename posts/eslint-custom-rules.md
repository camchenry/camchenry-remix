---
title: "How to write custom ESLint rules for your project"
summary: "TODO: Summary"
publishedAt: "2022-11-14"
tags:
  - eslint
  - javascript
type: til # 'guide' or 'post'
published: false
---

Recently, I've been working on a project where I wanted to enforce some project-specific coding rules. We already use [ESLint](https://eslint.org/) for linting, so I decided to write a custom rule for it.

Unfortunately, there did not seem to be an easy way to write a single file as an ESLint rule. Most examples I found were for writing a plugin and publishing it, which can be a bit of a hassle for a simple use case.

I found this post by Steven Petryk, which explains [how to write custom ESLint rules without publishing to NPM](https://stevenpetryk.com/blog/custom-eslint-rules/), which is exactly what I was looking for! The code in this article is adapted from the article for my own use case. So, here's a quick guide on how to write a custom ESLint rule for your project.

---

First, create a new directory (or pick an existing one). In my case, I created a new directory called `eslint` for storing my custom rules and "ESLint plugin" (essentially, a collection of rules files in a directory). My project setup looks like this:

```text
src/
  ... app code ...
eslint/
  ... new code here ...
eslint.config.js
```

Create `index.js` at `eslint/index.js` with the following code which will define our ESLint plugin:

```js

```
