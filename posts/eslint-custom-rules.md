---
title: "How to write custom ESLint rules for your project"
summary: "ESLint is a great tool for analyzing code, but it can be a bit of a hassle to set up when it comes to making your own rules. This is a quick guide on how to create a TypeScript ESLint plugin, write a custom rule, and write tests for it."
publishedAt: "2022-11-14"
tags:
  - linting
  - javascript
type: til # 'guide' or 'post'
published: true
---

Recently, I've been working on a project where I wanted to enforce some project-specific coding rules. We already use [ESLint](https://eslint.org/) for linting, so I decided to write a custom rule for it.

Unfortunately, there did not seem to be an easy way to write a single file as an ESLint rule. Most examples I found were for writing a plugin and publishing it, which can be a bit of a hassle for a simple use case.

I found this post by Steven Petryk, which explains [how to write custom ESLint rules without publishing to NPM](https://stevenpetryk.com/blog/custom-eslint-rules/), which is exactly what I was looking for! I've adapted the code in that article for my own use case and updated it to support TypeScript. So, here's a quick guide on how to write a custom ESLint rule for your project.

## Creating a ESLint plugin

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
const fs = require("fs");
const path = require("path");

const ruleFiles = fs
  .readdirSync(__dirname)
  .filter((file) => file !== "index.js" && !file.endsWith("test.js"));

const rules = Object.fromEntries(
  ruleFiles.map((file) => [path.basename(file, ".js"), require("./" + file)])
);

module.exports = { rules };
```

To start using our ESLint rules we need to "install" this plugin, which requires modifying the `package.json` dependencies:

```json
{
  // ...
  "devDependencies": {
    // ...
    "eslint-plugin-camchenry": "file:./eslint"
  }
}
```

The text after `eslint-plugin` can be anything you want, I've named my plugin `camchenry`, but you should replace this with your own project name. This will be used to prefix the name of your custom rules, so that they don't conflict with other rules.

Then, run `npm install` (or your preferred package manager) to set up everything correctly. Now we can enable this plugin in our ESLint config to start using it.

```json
{
  // ...
  "plugins": ["camchenry"]
}
```

Great! However, we don't have any rules yet, so let's write an example one now.

## Creating a custom ESLint rule

Let's create a rule for preventing single letter variables like `x` or `i`. Create a new file called `no-single-letter.js` in the `eslint` directory with the following code:

```js
// @ts-check
/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  create(context) {
    return {
      Identifier: function (node) {
        if (node.name.length === 1)
          context.report({
            node,
            message: "Avoid single-letter identifiers",
          });
      },
    };
  },
};
```

Now we can enable this rule in our ESLint config file:

```json
{
  // ...
  "rules": {
    "camchenry/no-single-letter": "error"
  }
}
```

## Testing a custom ESLint rule

If we want to ensure that this rule works properly, we can write some tests for it. ESLint comes with a [RuleTester](https://eslint.org/docs/latest/developer-guide/nodejs-api) utility that lets you write tests for lint rules quite easily and it works with most testing tools. Create a new file in the `eslint` directory called `no-single-letter.test.ts` with the following code

```js
import noSingleLetter from "./no-single-letter";
import { RuleTester } from "eslint";

const ruleTester = new RuleTester({
  parser: require.resolve("@typescript-eslint/parser"),
});

const errors = [{ message: "Avoid single-letter identifiers" }];

ruleTester.run("no-single-letter", noSingleLetter, {
  valid: [{ code: `const num = 123;` }],
  invalid: [{ code: `const x = 123;`, errors }],
});
```

Then we can run Jest (or any other testing tool) to run the tests and ensure that our rule works as expected.
