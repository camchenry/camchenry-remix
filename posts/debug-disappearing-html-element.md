---
title: "How to debug HTML elements that disappear from the document"
summary: "There are a few ways to debug temporary HTML elements and states, but there is a simple solution involving opening the debugger with a timeout."
publishedAt: "2022-11-14"
tags:
  - debugging
  - html
type: til # 'guide' or 'post' or 'til'
published: true
---

Quite often I have to debug some component that has behavior that depends on the mouse being hovered, having focus, or some other temporary state. These are normally difficult states to debug because using the developer tools often requires moving the mouse or changing focus.

However, I learned a simple trick recently for debugging these elements while in these states. The trick is to trigger the debugger after a certain period of time:

```js
setTimeout(() => {
  debugger;
}, 3000);
```

Simply run this command in the console, then get the document in the state you want to debug, and wait for the developer tools to be opened. Then, you should be able to freely inspect the DOM at the moment the debugger was started. This is not the most rigorous way to do this, but I find it the one that is easiest to remember how to do.

If this doesn't work you, there are also a few other ways to do this:

- [Using changes in the DOM to trigger a breakpoint](https://developer.chrome.com/docs/devtools/javascript/breakpoints/#dom)
- [Triggering pseudo-classes with the developer tools](https://umaar.com/dev-tips/43-trigger-pseudo-class/)
