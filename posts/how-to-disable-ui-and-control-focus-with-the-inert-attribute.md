---
title: "How to disable UI and control focus with the inert attribute"
summary: "The inert attribute is a new accessibility primitive can be used to disable off-screen or non-interactable UI elements and prevent focus from moving to them."
publishedAt: "2023-05-13"
tags:
  - html
  - react
  - accessibility
type: til # 'guide' or 'post' or 'til'
published: true
---

This week, I learned about how to use the [`inert` HTML attribute](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/inert) to disable certain areas of the UI and prevent focus from moving to them. In this particular case, we wanted to prevent focus from moving to an element that was only visible while dragging and dropping an item. This was a visual hint, but we didn't want it to be discovered by screen readers or be interactable in any way.

## What the `inert` attribute does

The `inert` attribute does the following things:

- Prevents the element from being interacted with (e.g. clicking, typing, selection, etc.)
- Prevents the element from receiving focus
- Prevents the element from being discovered by screen readers (should be effectively removed from the accessibility tree)

## Why use `inert`

Anytime that you want to leave content in the DOM, but render it "untabble" by the user, you can use the `inert` attribute. This is useful for things like:

- Rendering an inert modal in the DOM, until opened, then making the page content inert and the modal non-inert. This effectively traps focus to elements in the modal.
- Disabling a large portion of the UI (e.g., while submitting a form or disabling non-applicable parts of a form)
- Hiding off-screen content, for example virtualized content that is rendered just-in-time as the user scrolls, or elements rendered just for animation purposes

## How to use `inert` with React

In plain HTML, using the `inert` attribute is as simple as adding it to an element:

```html
<div inert>
  <p>This content is inert</p>
  <button>This cannot be interacted with</button>
</div>
<div>
  <p>This content is not inert, and focus will be trapped in this div</p>
  <button>This can be interacted with</button>
</div>
```

However, [React doesn't quite yet support the `inert` attribute](https://github.com/facebook/react/issues/17157) as a boolean attribute. This attribute was only [recently added to all major browser engines](https://caniuse.com/mdn-api_htmlelement_inert), with Firefox being the latest to add it in April 2023.

Until React supports `inert` as a boolean attribute (which might be true by the time you are reading this), you can declare it as a string attribute and use [truthiness](https://developer.mozilla.org/en-US/docs/Glossary/Truthy) instead. We will use `undefined` as `false` and the literal string `"inert"` as `true`. This follows the convention for [boolean HTML attributes in the HTML standard](https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#boolean-attributes).

```tsx
import * as React from "react";

declare module "react" {
  interface HTMLAttributes<T> {
    /**
     * Prevents focus from moving to any element inside this DOM element and ignores user events.
     * https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/inert
     */
    inert?: "inert";
  }
}
```

Then, you can use it like a boolean attribute:

```tsx
const UI = (inert: boolean) => (
  <div inert={inert ? "inert" : undefined}>
    <button>Should be inert</button>
  </div>
);
```

## Resources

- [WCAG explanation on GitHub](https://github.com/WICG/inert/blob/main/explainer.md#the-case-for-inert-as-a-primitive)
- [`inert` attribute on MDN](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/inert)
