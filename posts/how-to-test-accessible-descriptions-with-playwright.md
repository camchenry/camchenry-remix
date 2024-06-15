---
title: "How to test accessible descriptions with Playwright"
summary: "Playwright recently added support an assertion to check accessible descriptions and labels, allowing you to more easily test the accessibility of elements in your web application."
publishedAt: "2024-06-15"
tags:
  - accessibility
  - playwright
type: til # 'guide' or 'post' or 'til'
published: false
---

Playwright [recently added support for an assertion to check accessible descriptions and labels](https://github.com/microsoft/playwright/issues/18332), allowing you to more easily test the accessibility of elements in your web application. This is available in [Playwright version 1.44](https://playwright.dev/docs/release-notes#version-144) and up.

Prior to this release, getting the accessible description for an element was a bit more involved and not straightforward. Now, it's super easy to check the accessible description of an element using the new [`toHaveAccessibleDescription()`](https://playwright.dev/docs/api/class-locatorassertions#locator-assertions-to-have-accessible-description) assertion.

```typescript
const input = await page.getByRole("textbox", { name: "Password" });
await expect(input).toHaveAccessibleDescription(
  "Passwords must be at least 12 characters long"
);
```

Conveniently, they've also added [`toHaveRole()`](https://playwright.dev/docs/api/class-locatorassertions#locator-assertions-to-have-role) and [`toHaveAccessibleName()`](https://playwright.dev/docs/api/class-locatorassertions#locator-assertions-to-have-accessible-name) assertions, which can be used in a similar way, even though we already have the [`getByRole()`](https://playwright.dev/docs/api/class-framelocator#frame-locator-get-by-role) and [`getByLabel()`](https://playwright.dev/docs/api/class-framelocator#frame-locator-get-by-label). It's great to have more options for doing automated web accessibility testing.
