---
title: "Essential Tools for Production-Ready React Apps"
summary: "In this post, we'll look at the tools and technologies that I would recommend based on my personal experience for building feature packed, maintainable, and production-ready React apps."
publishedAt: "2021-01-29"
tags:
  - react
  - build-tools
  - linting
---

## Introduction

One of the most difficult aspects of front-end web development is figuring out what tools to use. It's so difficult
that we have a special term for it: "JavaScript fatigue." It's that feeling of burnout that comes so many new languages,
tools, technologies, and libraries being released all the time in the JavaScript ecosystem.

To help tackle this fatigue, we'll look at the tools and technologies that I would recommend based on my personal experience for building feature packed, maintainable, and production-ready web apps.

### What this is about

This post will cover the essential tools that I would recommend most teams should consider using for their build pipelines. These tools help to ensure consistently high quality code output for React applications. My suggestions are centered around React but most of these tools should be just as practical for applications written in other frameworks as well.

This post will NOT cover proprietary CI/CD tools such as GitHub Actions, GitLab CI, Azure DevOps, and many others. There are a plethora of posts already published which go in depth with how to effectively use these tools. This post will cover what those posts don't: what do we actually run in our CI/CD setup?

### Who this is for

This post is for anyone trying to pick tools to use for new React development or trying to add tools to an existing project to
ensure consistently high quality code output. If you are a: newcomer, expert, individual, small team, or large team that is
concerned about maintainability, preventing bugs, accessibility, portability, or security, then this is post is
intended for you.

### Why this post exists

As mentioned before, picking tools to use and finding new tools is a big part of web development whether we like it or not.
So, I made this post to share the knowledge that I have about the tools that I use. I've also narrowed the tools listed
here to tools that I believe to be maintainable, usable in teams, configurable, fast, and well-supported. In addition,
I have personally used and would recommend all of these tools for deploying non-trivial software in production.

All of the recommendations, opinions, and definitions below are my own, based on my experience. These lists are not
exhaustive, nor are they authoritative. I'm always learning, so if you have suggestions on tools that meet the criteria
listed and do it better, then I'd love to know about it.

### Important note for create-react-app users

[create-react-app](https://create-react-app.dev/) (CRA) is by far one of the most popular ways to set up a React project, and rightfully so. It reduces the amount of setup time needed to start developing a new React application by picking well supported tools and configuring them for typical development workflows.

So, if you're using create-react-app, then you can essentially skip the following sections, because they are already chosen for you:

- Bundler (CRA uses Webpack)

- Linter (CRA uses ESLint)

- Unit testing (CRA uses Jest)

## Essential Tools

### Bundler / Build Tool

A **bundler** is a tool that takes all of your project files and dependencies as input, and outputs a single or a few highly optimized and portable JavaScript files as output.

Bundlers help bridge the gap between how we would like to develop the application while writing new features, and how we want to actually deploy that app into production. If you're only supporting extremely modern and up-to-date browsers, then technically you don't need a bundler. Using a bundler is generally an optimization, and a post-development one at that. But if you want to support most users across most platforms, then using a bundler is a wise business decision.

A **build tool** is an all-in-one tool for building a web application. Many build tools are also bundlers, or at least have a bundler included. These terms are often used interchangeably. So for that reason, I have grouped these tools together since bundling is one of the primary purposes of a build tool, though it is not the only one. In most cases, it will also encompass goals such as code optimization, minimization, and portability.

If you're already using create-react-app, then you're already using preconfigured webpack, so you don't need to worry about this.

#### Recommendations

- Popular pick: [Webpack](https://webpack.js.org/)

- Also good: [Rollup](https://rollupjs.org/guide/en/)

- Easy to set up: [Parcel](https://parceljs.org/)

- Cutting-edge and modern: [Snowpack](https://www.snowpack.dev/)
  - Snowpack is maybe not quite "production-ready" as far as bundling goes, but it can absolutely be used as a
    replacement for Webpack in development, while still using Webpack to create bundles for deployment.

### Linter

A **linter** is a tool for validating a set of checks and rules against your source code, and is used to ensure that your code meets a minimum standard of quality. These rules are generally flexible enough to help you achieve many different goals: performance, portability, maintainability, consistency, accessibility, and so on.

If you're already using create-react-app, then you're already using ESLint, so you don't need to worry about picking a linter.

#### Recommendations

At the moment, the only tool I can personally recommend is [ESLint](https://eslint.org/). It is configurable, easy to
use, fast, well-supported, and has many rules built-in.

#### Using ESLint

Using ESLint in your CI/CD setup is quite simple. Once it is installed, just run:

```bash
eslint .
```

Or replace "." with your source code directory. To automatically apply lint fixes to your code, run:

```bash
eslint --fix .
```

although normally this should be done through a pre-commit hook or editor plugin.

### Formatter

A **formatter** is a tool that automatically formats your code consistently to make it more readable and enforce certain styles.

Why use a formatter? In short, coding style is a frequent issue that comes up in code reviews and can take up a lot of time. A formatter can fix this issue permanently and automatically. No discussion or arguments needed, no time lost. It helps make code easier to read, and it helps newcomers to format code in exactly the same way as an expert.

#### Recommendations

This section has the fewest number of options available, because currently Prettier is the de facto tool for formatting JavaScript code. Honorable mention goes to ESLint which can also act as a formatter. It has a lot of configuration options, but lacks the ease of use and focus that Prettier possesses.

- Popular pick: [Prettier](https://prettier.io/)

- More setup, but most configurable: [ESLint](https://eslint.org/)

#### Using Prettier

Most often you will want code to be formatted automatically by an editor or other tool. To check that the formatting is consistent in your, run this in your CI tool:

```bash
prettier --check .
```

Or replace "." with your source code directory. To actually format your code, run:

```bash
prettier --write .
```

#### Using ESLint

See the "Using ESLint" header under the "Linter" section above.

## Testing tools

### Unit testing

There's not much more that I can say about unit testing that others haven't already. In short, I would highly recommend having *some *kind of unit testing library to help you ensure that your code works exactly as you expect it to.

If you're already using create-react-app, then you're already using Jest as the test runner by default so you don't need to worry about this.

#### Recommendations

- Popular pick: [Jest](https://jestjs.io/)
- In addition: [React Testing Library](https://testing-library.com/react)

#### Using Jest

As long as Jest is installed, it suffices to just run:

```bash
jest
```

If you are using create-react-app, then Jest should already have a script configured in `package.json`, so all you need
to run is:

```bash
npm test
```

The [Jest documentation](https://jestjs.io/docs/en/tutorial-react) gives more in-depth information on testing React applications.

### Integration Testing

Integration testing complements unit testing to ensure that components work well together, not just in isolation. The
scope of integration testing can be narrow or broad, but all of these tools can perform almost any level of testing required.
They can perform unit testing (at some level) for single components, or end-to-end testing where the entire application is
tested at once.

The value of all of these recommendations is realized in a few ways:

- **Cross-platform**: tests can be run in different browsers such as Chrome, Firefox, and Edge without rewriting test code.
- **Fast**: tests are run as quickly as possible so that integration testing can be done in a CI/CD pipeline/runner.
- **Easy to use**: other test tools in the past have been very difficult to use in a few ways like having unwieldy APIs, being
  hard to setup and causing flaky tests / random failures

#### Recommendations

- Popular pick: [Puppeteer](https://pptr.dev/)

- Personal favorite: [Cypress](https://www.cypress.io/)

- Up and coming: [Playwright](https://playwright.dev/)

#### Using Puppeteer

Puppeteer is just a library like anything else, which is one of the reasons that it is so easy to get started with. It
is compatible with Node.js, so the test code can be run directly with Node.

```bash
node tests.js
```

#### Using Cypress

Unlike Puppeteer, Cypress is more like an entire framework for writing integration tests. Thankfully, that doesn't make
it any harder to run tests.

For running Cypress locally for in-development testing, you should run

```bash
cypress open
```

to open the Cypress Test Runner, which can run individual tests instead of the entire project.

For CI/CD, you should run Cypress in headless mode and in parallel for maximum performance. This can be done by running

```bash
cypress run --headless --parallel
```

More info on the [Cypress CLI](https://docs.cypress.io/guides/guides/command-line.html) can be found in the documentation.

#### Using Playwright

If you are using Jest (my personal pick for testing), then Playwright has a [library for integrating Playwright with Jest](https://github.com/playwright-community/jest-playwright)
so you don't have to run any extra commands or do more setup. The steps would be the same as "Using Jest" in the section above.

## Security tools

### Dependency auditing

Auditing your dependencies for known vulnerabilities is a low-effort way to improve the security of your application. This does NOT verify the absence of vulnerabilities, but this does alert to the presence of known vulnerabilities. If you could only run one security process in your pipeline, make it this.

#### Recommendations

- Popular pick: [npm audit](https://docs.npmjs.com/cli/v6/commands/npm-audit)

- Also great: [audit-ci](https://github.com/IBM/audit-ci)

#### Using npm audit

If you're using the default npmjs registry, then in your CI/CD setup, run:

```bash
npm audit
```

If you're using a private registry, run:

```bash
npm audit --registry <registry>
```

If any issues are found, you can fix any issues by running:

```
npm audit fix
```

#### Using audit-ci

The easiest way to run audit-ci is via npx. Assuming npx is installed, just run this in your CI/CD tool:

```bash
npx audit-ci --moderate
```

to ensure that any moderate vulnerabilities will fail the pipeline.

### Prevent leaking secrets

Secrets being leaked is a bad thing that you do not want to happen. It means revoking and regenerating access tokens,
potentially patching applications, and possibly issuing security breach notices. One of the ways that this can happen
is by accidentally committing a file which contains a secret, or copying and pasting a secret into code and forgetting
to remove it. Thankfully, secrets being accidentally committed is something that can be automatically checked

#### Recommendations

I would recommend using [`eslint-plugin-no-secrets`](https://github.com/nickdeis/eslint-plugin-no-secrets) to prevent
secrets from being accidentally committed. It flags "high entropy" strings which might be secrets, as well as known
patterns for secrets such as AWS access tokens, SSH private keys, OAuth tokens, and so on.

Once installed, add the rule `"no-secrets/no-secrets":"error"` to the ESLint configuration file. Then, any
potential secrets will be flagged when `eslint` is run.

## Accessibility tools

Accessibility is a current area of focus for me that I am striving to learn more about and improve in my applications.
Automated tools can make a huge difference here, since manually testing accessibility of a website can be extremely
tedious. It is also an area which has seen lots of new tools and new development. There are a lot more tools to help
us implement accessibility correctly now more than ever.

### Recommendations

- Popular pick: [eslint-plugin-jsx-a11y](https://github.com/jsx-eslint/eslint-plugin-jsx-a11y)

- Also great: [axe-core](https://github.com/dequelabs/axe-core)

## Conclusion

In this post, I've listed out all of the tools that I recommend for building production-ready React web apps. We covered
some essential tools like build tools and linters, as well as additional automated tools like formatters and dependency
auditors. Running some of these automated tools is a vital part of software development and the key to doing CI/CD.
