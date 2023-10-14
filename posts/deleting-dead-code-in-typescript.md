---
title: "How to Delete Dead Code in TypeScript Projects"
summary: "Deleting dead code is a worthwhile effort that reduces the amount of that code that has to be downloaded, compiled, and maintained. Using automated tools, we can simplify the process of identifying dead code and removing it."
publishedAt: "2021-08-30"
updatedAt: "2023-10-14"
tags:
  - typescript
type: "guide"
published: true
---

## Contents

## What is dead code?

"Dead code" is code that is never used. It is not referenced by any other code, it is not imported, it is not used in
the final build in any way.

Refactoring a project to make certain types, methods, or properties obsolete without removing that obsolete code
will create dead code. Changing the direction of a project, like choosing to use a different API or library
can also produce dead code. On large projects with many different teams and shifting priorities,
**the occurrence of dead code is inevitable**.

## Why should you delete dead code?

There are many reasons why you should delete dead code. There are many effects that dead code can have on a large project:

1. Dead code must be compiled, which slows down the compilation time. It may be included in the final output too, increasing the total executable size.
2. Dead code must be downloaded, which increase the project size.
3. Dead code may reference other dead code and make it appear important.
4. Dead code must be understood, which makes the project harder to maintain and work on.

When you delete dead code, you:

1. Make it easier to understand and maintain a project.
2. Speed up compilation time.
3. Decrease the project size.

As a result of removing dead code, a program will be faster to download and compile, and its output executable will be smaller and faster.

## How to find dead code

First, you will need to be using TypeScript in your projects for these tools to work. TypeScript simplifies the difficult
task of determining whether any given piece of code is actually used or not.

Second, you will want to install [`ts-prune`](https://github.com/nadeesha/ts-prune) and [`ts-unused-exports`](https://github.com/pzavolinsky/ts-unused-exports) globally, so they can be used for any project. Run these commands in a terminal:

```bash
npm install -g ts-prune ts-unused-exports
```

In my experience, no single tool will give perfect results for identifying dead code. So, I recommend alternating
between both of these tools to find dead code.

### How to use `ts-prune`

To run `ts-prune`, run the following command in a terminal:

```bash
ts-prune --project tsconfig.json
```

You should see some output like this:

```text
\src\components\Avatar\index.ts:18 - STYLE_CLASSES
\src\components\BulkActions\index.ts:26 - BulkAction
\src\components\CheckableButton\index.ts:13 - CheckableButtonProps
\src\components\Choice\index.ts:9 - ChoiceProps
\src\components\Combobox\index.ts:2 - ComboboxTextField
\src\components\DataTable\utilities.ts:34 - isEdgeVisible (used in module)
\src\components\DropZone\index.ts:38 - DropZoneFileType
\src\components\IndexTable\index.ts:6 - CellProps
\src\components\IndexTable\index.ts:11 - Cell
```

The left-hand side is the file and line number of where the potential dead code occurs. The right-hand side is the name
of the export that appears to be unused. If the export is only used internally, it will have the text `(used in module)`
appended to it. If the default export is unused, the right-hand side will say `default`.

I'm OK with unused exports as long as the export is used internally, so I recommend filtering out the lines
with `(used in module)` in them. You can do that by piping the output into `grep`:

```bash
ts-prune --project tsconfig.json | grep -v '(used in module)'
```

### How to use `ts-unused-exports`

To run `ts-unused-exports`, run these commands in a terminal:

```bash
ts-unused-exports tsconfig.json
```

which should create some output like this:

```text
src\utilities\features\index.ts: Features, useFeatures
src\utilities\focus-manager\index.ts: FocusManagerContextType
src\utilities\frame\index.ts: FrameContextType
src\utilities\index-table\index.ts: useRowHovered
src\utilities\listbox\index.ts: ListboxContextType
src\utilities\media-query\index.ts: MediaQueryContextType
src\utilities\portals\index.ts: PortalsManager
src\utilities\resource-list\index.ts: ResourceListContextType
src\utilities\theme\index.ts: ProcessedThemeConfig
src\utilities\theme\types.ts: ThemeLogo, Role, AppThemeConfig
src\utilities\theme\utils.ts: buildCustomPropertiesNoMemo
```

The left-hand side lists the file that contains unused exports. The right-hand side lists the names of unused exports in the file. If the
default module export is unused, the right-hand side will include `default`.

I will often ignore unused types, since it is typically not much of an issue. In many cases, it is indicative of work that
is in progress. It is also not included in the compiled JavaScript (since types don't exist in JavaScript), so leaving it
in the project won't affect the build size. To do that, add the `--allowUnusedTypes` flag to the command:

```bash
ts-unused-exports tsconfig.json --allowUnusedTypes
```

## How to delete dead code

Unfortunately, you will have to manually go through each result and determine whether to keep it or delete it. There is often a moderate false positive rate when it comes to finding dead code. **Not all unused code is dead code, but all dead code is unused code**.

If any patterns emerge while identifying dead code, I recommend automating the process. Create scripts to combine the results from these tools. Filter it to remove any false positives. Then, automatically generate diffs to remove dead code. For small projects, this is probably overkill (and that's OK). For large projects, this is a [force multiplier](https://en.wikipedia.org/wiki/Force_multiplication) that will make everyone on your team more productive.

When deleting dead code, there are a couple exceptions that I always keep in mind:

1. Exported component prop types are OK. These may not be "used," but they will likely be used by consumers of the module to create derivative types.

   ```ts
   // OK:
   export type ComponentProps = {
     /* ... */
   };
   ```

2. Exported default values are OK. These allow consumers of a module to access the implicit default values of objects and functions, which are otherwise inaccessible programmatically.

   ```ts
   // OK:
   export const defaultFadeTime = 100;
   export function animate(fadeTime = defaultFadeTime) {
     /* ... */
   }
   ```

3. Recently added code (less than a month old) is probably OK. Sometimes in-progress work will appear unused because it is incomplete.

   ```ts
   // Probably OK:
   const UserTable = () => {
     /* TODO: Going to implement this next week */
   };
   // NOT OK:
   const UserTable = () => {
     /* TODO: Going to implement this next week ... 2015-06-01 (6 years ago) */
   };
   ```

4. Metadata and specific code may be OK. If there are pieces of code that serve a special purpose (e.g. preprocessed by another tool, expected by a framework, etc.) then it may not be unused or dead code. For example, server-side rendered frameworks may export functions that are not used in the client output, but are rendered on the server instead.

   ```ts
   // OK: special function used by the Next.js framework
   export async function getServerSideProps({ req, res }) {
     /* ... */
   }
   ```

## Common problems

### Many false positives due to barrel files

If you run these tools on your codebase and find that there are many false positives (i.e., exported things which are not actually dead code), and those items are re-exported more than once, then you may have a problem with barrel files.

Barrel files are files that export many things from other files. They are often used to simplify imports. For example, instead of writing this:

```ts
// file: src/components/button.ts
export const Button = () => ()

// file: src/components/avatar.ts
export const Avatar = () => ()

// file: src/index.ts
import { Button } from "./components/button";
import { Avatar } from "./components/avatar";
//       ^-- have to import each component individually
```

You can instead write this:

```ts
// file: src/components/button.ts
export const Button = () => ()

// file: src/components/avatar.ts
export const Avatar = () => ()

// file: src/components/index.ts (BARREL FILE)
export * from "./button";
export * from "./avatar";

// file: src/index.ts
import { Button, Avatar } from "./components";
//       ^-- can conveniently import all components from a single file
```

The tradeoff with barrels is that while they simplify the imports that you need to write, it dramatically increases the number of exports that you have. This can cause performance issues in very large projects [^1] and will also add unused exports, which are eventually flagged as dead code by tools like `ts-prune` and `ts-unused-exports`, even if a different version of the export _is_ actually used.

As an example, given this project structure (with barrel file), but where we are not actually using the barrel file exports:

```ts
// file: src/components/button.ts
export const Button = () => ()

// file: src/components/avatar.ts
export const Avatar = () => ()

// file: src/components/index.ts (BARREL FILE)
export * from "./button";
export * from "./avatar";

// file: src/index.ts
import { Button } from "./components/button";
import { Avatar } from "./components/avatar";
//       ^-- NOTE: We have re-exported, but we are not using the barrel file
```

When we run `ts-prune` on this, we will get the following output:

```text
src/components/index.ts:1 - Avatar
src/components/index.ts:1 - Button
```

At first glance, this makes it seem like Avatar and Button aren't being used. However, this is just due to us exporting these functions but never using the exports from the barrel file.

#### How to fix

To fix these issues, you have two main choices:

1. Remove the export from the barrel file specifically (e.g., remove `export * from "./button"`)
2. Remove the barrel file entirely (e.g., remove `src/components/index.ts`)

My recommendation would be to remove the barrel file entirely, for a few reasons:

1. It is easier to maintain. You don't have to worry about keeping the barrel file in sync with the other files.
2. It is faster to parse/compile: the compiler doesn't have to parse the barrel file and all of its dependencies, and neither will other tools like linters or formatters.
3. It reduces the total number of exports, which can improve performance in large projects [^1].

[^1]: <https://marvinh.dev/blog/speeding-up-javascript-ecosystem-part-7/>

## Conclusion

Deleting dead code is a worthwhile effort that can make working in a project faster and easier. Using the `ts-prune` and `ts-unused-export` tools, we can simplify the process of identifying dead code.

Automating the process of finding dead code and deleting it is a great task to learn how to do. Everyone on your team will appreciate having less code to download, compile, and understand. In addition, it will speed up any tools that you use as they no longer have to parse it. And it will help you understand your codebase better. You'll probably learn many other useful skills along the way too.

Good luck and happy hunting!
