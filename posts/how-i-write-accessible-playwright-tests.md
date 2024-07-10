---
title: "How I write accessible Playwright tests"
summary: "Five practical tips for writing tests to check the accessibility of web applications with Playwright, as well as generally improve the robustness of end-to-end tests."
publishedAt: "2024-06-29"
tags:
  - accessibility
  - playwright
type: post # 'guide' or 'post' or 'til'
published: true
---

In this post, I am going to share some practical tips on how I try to test accessibility using Playwright. These tips come from my personal experience and also reflect my personal philosophy on testing. I believe that incorporating accessibility testing into your automated tests is important to ensure that your web application is usable by people with disabilities and those using assistive technologies such as screen readers.

## 1. Prefer using locators

[Locators](https://playwright.dev/docs/locators) are one of the core technologies in Playwright that make it great for writing robust tests. A locator is a method that specifies how to find an element in the page. It will automatically retry finding the element if it isn't found initially, and can be referenced multiple times, even if the page disappears and reappears.

There are APIs like the [`$` function](https://playwright.dev/docs/api/class-elementhandle#element-handle-query-selector) and [`waitForSelector` function](https://playwright.dev/docs/api/class-elementhandle#element-handle-wait-for-selector), but these do not benefit from automatic retries and are not as robust as locators. I recommend using locators as much as possible when writing tests. While not strictly related to accessibility, locators encourage a mode of thinking that aligns well with writing accessible tests. Locators emphasize _how_ to find an element, rather than _what_ the element is.

Another benefit of using locators is that we can combine it with locator assertions to automatically check that an element is actionable or visible, for example. Here is an example of how you might use a locator to check that a button is visible and then click it:

```html
<button>Search</button>
```

```typescript
// Old way, without locators:
const button = await page.$("button");
await button.waitForElementState("visible"); // Redundant with click(), just for example
await button.click();

// New way, with locators (prefer this!):
const button = await page.getByRole("button");
await expect(button).toBeVisible(); // Redundant with click(), just for example
await button.click();
```

## 2. Prefer using semantic locators

When writing tests, I use locators that reference the inherent meaning of content on the page as much as possible. By "semantic locators" I mean using the built-in methods to Playwright that use things such as labels and roles to identify elements on the page. In contrast, a non-semantic locator would be something that identifies an element by its HTML tag name, a custom testing attribute on an element, or through a CSS selector query.

For example, some of these built-in locators are:

- [`getByRole`](https://playwright.dev/docs/locators#locate-by-role)
- [`getByText`](https://playwright.dev/docs/locators#locate-by-text)
- [`getByLabelText`](https://playwright.dev/docs/locators#locate-by-label)
- [`getByPlaceholderText`](https://playwright.dev/docs/locators#locate-by-placeholder)
- [`getByAltText`](https://playwright.dev/docs/locators#locate-by-alt-text)

When using HTML elements like `<input>`, `<button>`, and `<label>` correctly, it imbues a ton of meaning into the page by default and ensures that these elements are accessible to screen readers and other assistive technologies.

APIs like `locator`, `getByTestId`, should be used as a last resort, as they generally rely on implementation details and encourage a testing strategy that is not centered around maintaing an accessible user experience.

## 3. Prefer selecting on accessible name over specific attributes

Elements that have defined ARIA roles should typically have an [accessible name](https://tetralogical.com/blog/2023/04/05/accessible-names-and-descriptions/). There are a number of ways that accessible names are computed, but some of the most common are:

- The content of an element (e.g. the text inside a `<button>`)
- An `aria-label` on the element
- An associated `<label>` element (for form controls)

A good start at trying to check accessible names is using a locator that looks at the `aria-label` to check the name of an element:

```html
<button aria-label="Close">X</button>
```

```typescript
page.locator('[aria-label="Close"]');
```

However, this suffers from a big problem: there are multiple ways an element can get an accessible name, not just `aria-label`. For example, the element could be switched to use the `aria-labelledby` attribute instead to make it so that it gets an accessible name from another element on the page. Semantically, there is no difference between using `aria-labelledby` and `aria-label`, but since our test locator specifically references `aria-label`, it would fail.

Instead, I recommend using the `getByLabelText` locator, which checks for the accessible name of an element regardless of how it is defined:

```typescript
page.getByLabelText("Close");
```

This locator will now work for all of the following examples:

```html
<!-- content (prefer doing this!) -->
<button>Close</button>

<!-- aria-label -->
<button aria-label="Close">X</button>

<!-- aria-labelledby (I don't recommend doing this, just for example) -->
<button aria-labelledby="close-label">
  <span id="close-label">Close</span>
  <!-- other content -->
</button>
```

## 4. Prefer using role locators

Although using semantic locators by default is a good practice, they are not all made equal. For example, label text can theoretically be added to almost any element, even if it's not an element that should be labeled (such as a purely structural element like `<div>`). In addition, it is possible to use an element `<button>` like a button and forget to add any name to it, like if an icon is the only content inside of it.

In general, my recommendation would be to use a role locator in combination with a name locator. This does two main things:

1. Ensures the element has a recognizable role (such as `button` or `textbox`)
2. Ensures the element has an understandable name

This helps to ensure that the accessibility of an element is tested more thoroughly while making changes to the underlying code and design.

### Example

Here's an example of how you might use a role locator in combination with a name locator, as well as a comparison with other potential locators that are not preferred.

```html
<label for="password">Password</label>
<input id="password" data-testid="password-input" type="password" />
```

```typescript
// Not good, says nothing about semantics:
page.locator("#password");

// Better, but still not ideal:
page.getByTestId("password-input");

// Better, but missing name:
page.getByRole("textbox");

// Best:
page.getByRole("textbox", { name: "Password" });
```

Let's compare what the best and worst each check. First, the `page.locator('#password')` example:

- Checks that there is an element with the ID `password` on the page
  - This is a very specific implementation detail that is not necessarily related to the content or purpose of the element. It could easily break if we accidentally added another element with the same ID.

And that's pretty much it. Now, compare with the `page.getByRole("textbox", { name: "Password" })` example:

- Checks that there is an element with a role of `textbox`
  - This is automatically true for `<input>` elements that are text fields or password fields, but can also be implemented by custom elements too
- Checks that the element has a name of "Password"
  - This can be specified by `aria-label`, `aria-labelledby`, or using the `<label>` element and associating it with the input. This locator is more robust, because it doesn't care _how_ it gets the accessible name, just that it has one.

## 5. Ensure elements have unique accessible names

One problem that you may run into when using the accessible name locators is that there are multiple elements which have the same accessible name. This can be a problem because it can be difficult to determine which element you are actually selecting. For example, a list of elements that all have the same accessible name:

```html
<ul>
  <li>Field 1 <button aria-label="Edit">✍️</button></li>
  <li>Field 2 <button aria-label="Edit">✍️</button></li>
  <li>Field 3 <button aria-label="Edit">✍️</button></li>
</ul>
```

You may run into trouble when trying to click on one of these elements:

```typescript
await page.getByRole("button", { name: "Close" }).click();
```

This will fail because there are three buttons with the same accessible name. It may be tempting to reach for the `.nth` selector and specify the numerical index of the element you want to select, but this is not a good practice for several reasons:

- It is fragile and can break easily if the order of elements changes
- It doesn't necessarily relate to the meaning of the content on the page

Generally, [accessible names should be short, unique, and convey the function of the component](https://www.w3.org/WAI/ARIA/apg/practices/names-and-descriptions/#composingeffectiveanduser-friendlyaccessiblenames). We can fix this test error and improve the accessibility of the page by making the accessible names unique:

```html
<ul>
  <li>Field 1 <button aria-label="Edit field 1">✍️</button></li>
  <li>Field 2 <button aria-label="Edit field 2">✍️</button></li>
  <li>Field 3 <button aria-label="Edit field 3">✍️</button></li>
</ul>
```

Now, it is much more clear what the purpose of each button is when using assistive technology like a screen reader, but it is also easier to select the correct element in our test:

```typescript
await page.getByRole("button", { name: "Edit field 2" }).click();
```

## Conclusion

These are some of the practical tips that I have learned while writing tests for accessibility in Playwright. If you have other tips or suggestions, I would love to hear them! I hope this helps you out, good luck and happy coding!

## See also

- [How to test accessible descriptions with Playwright](./how-to-test-accessible-descriptions-with-playwright)
- [ARIA in HTML (W3C)](https://www.w3.org/TR/html-aria)
- [Foundations: accessible names and descriptions (TetraLogical)](https://tetralogical.com/blog/2023/04/05/accessible-names-and-descriptions/)
- [Providing Accessible Names and Descriptions (ARIA APG)](https://www.w3.org/WAI/ARIA/apg/practices/names-and-descriptions/#composingeffectiveanduser-friendlyaccessiblenames)
