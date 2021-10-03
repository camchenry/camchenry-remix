---
title: "How to power up the React Context API with TypeScript"
summary: "TODO: Summary"
publishedAt: "9999-01-01"
tags:
  - typescript
  - react
---

## What is the React Context API?

React Context is one of the core React APIs that can be used anytime you are developing with React. Context allows us to create a piece of state that is globally shared among many different components.
For example, an application might have a context for the current locale, language, or theme, because that data will be used by
many different components. Context is ideal for globally shared values.

<div class="note">
In this article the terms "Context" (uppercase) and "context" (lowercase) will be used interchangeably. Generally speaking, these
refer to the same thing. However, "Context" more often refers to the React Context feature, while "context" refers to the
general concept, or a specific instance of context (for example, an "authentication context" may use Context).
</div>

### What problems does React Context solve?

At its core, Context helps to solve one main issue: "prop drilling." Prop drilling is the name for when a property
must be passed down through an entire component tree in order to render the application.

For example, suppose that we store information about a user's application preferences (language, timezone, privacy, etc.) and need to use that to render the application correctly. To render the application, we must write something like:

```jsx
<App preferences={preferences} />
// Inside App:
<Profile preferences={preferences} />
// Inside Profile:
<Settings preferences={preferences} />
// ... and so on
```

Ultimately, we end up writing the same code repeatedly in order to pass that state down. Now, if we ever have to rename `preferences` or change its type, we have to change it for every component that passes that state down.

**That's a huge pain**, especially for large applications, where it's not unheard of to have components that are nested dozens of layers deep inside of other components.

In addition to the increased effort, this sort of behavior also makes components less flexible, because they are expected to take certain properties, and be nested in certain ways. So, restructuring and moving components around becomes more difficult.

So, how can we solve the prop drilling problem?

Enter React Context.

### How Context solves the problems with prop drilling

Context solves the problems that come from prop drilling by allowing components to "skip" an arbitrary number of layers in the component tree. In this way, components can access directly shared state directly.

In a context, there are two main pieces: the **provider** and the **consumer**.

- The provider is the component where the shared state is defined. All components under a provider will be rerendered when the state changes.
- A consumer is the component where the state from the provider is accessed and used. As long as it is a descendent of the provider, it can access the provider's state. **A consumer always reads the value of the nearest provider.**

#### An Analogy for Context

Imagine that a context is like a wireless network, where the provider is a 🌐 wireless network, and the consumer is a device like a 💻 laptop.

<table>
  <caption>Summary of comparison between wireless network and context</caption>
  <thead>
    <tr>
      <th width="50%">🌐 Wireless Network</th>
      <th width="50%">💡 Context</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>When a laptop is connected to the network, can send and receive data from anywhere, regardless of physical location</td>
      <td>When a consumer is nested under a provider, the consumer can send and receive state from anywhere, regardless of how it is nested (or how deeply nested).</td>
    </tr>
    <tr>
      <td>A laptop will try to find the closest access point in the network to get the best wireless signal.</td>
      <td>A consumer will try to find the closest provider (nearest ancestor) to get the current state.</td>
    </tr>
  </tbody>
</table>

A laptop that is connected to the network is like a consumer component that is nested under the provider. As long as the
laptop is connected, it can communicate and receive data regardless of where it is physically located. In the same way, as long as a consumer is under the provider, it can exist anywhere in the component tree and access state directly.

Similarly, a laptop always tries to find the closest access point in order to get the best signal possible. This is like the behavior of the consumer, which always reads the value of the nearest (least nested) provider. If there's no network (i.e., there is no context provider), then our laptop (consumer) can't work!

### How do we define a context?

Now that we understand what a context is and the problems that it solves, how do we actually create a context? The React API
offers two functions to create and use contexts, which are aptly named `createContext` and `useContext`, respectively.

For a simple example, we will create a theme context which tells all consumers whether the current theme is 🌚 `dark` or 🌞 `light`.

```typescript
import React from "react";

const ThemeContext = React.createContext("light");
```

We create a context called `ThemeContext`, which has a default value of `light`. The first argument of `createContext` is a default value which will be used if there are no providers. We will cover how to create a context without a default value later.

<div class="note">
The <code>ThemeContext</code> variable is uppercase because <code>createContext</code> returns an object which contains components.
The JSX convention is that components always start with an uppercase letter. So, that means we should uppercase <code>ThemeContext</code>
</div>

Then, in our application we would render the context just like any other component. In this case, we **don't render `ThemeContext` directly** (because it is an object), but instead we render `ThemeContext.Provider`.

```tsx
const App = () => (
  <ThemeContext.Provider value="light">
    {/* ... rest of the application code here ... */}
  </ThemeContext.Provider>
);
```

Then, our consumer is a component that calls `useContext` to access the state.

```tsx
const CurrentThemeDisplay = () => {
  const theme = React.useContext(ThemeContext); // this will be "light"
  return <div>{theme}</div>;
};
```

Now, we can place `CurrentThemeDisplay` anywhere underneath the `ThemeContext.Provider` and it will always get the current theme:

```tsx
const App = () => (
  <ThemeContext.Provider value="light">
    <CurrentThemeDisplay />
  </ThemeContext.Provider>
);
```

Ultimately, this example will end up rendering:

```html
<div>light</div>
```

### A note about class-based Context

There is a class-based version of React Context that uses "render props" and the `ThemeContext.Consumer` component. However, if you are just starting a new React application, I would recommend that you do not use these APIs.
While working on a large React application, I've never had any need to use the old class API or render props.

React Hooks completely revolutionized the way that we can interact with a context and makes it much easier to reuse contexts
and compose them together. In my opinion, the newer, functional API is easier to understand and scales very well to large applications.

<hr />

## How TypeScript helps us work with contexts

So far, we've covered the basics of how to use the Context API, but how does TypeScript help us use context more effectively?

To answer that, let's look at some of the issues that we might experience when using JavaScript and contexts:

- Accessing a non-existent property in the context could cause an error
- Renaming a property in the context, or change its type (e.g., from `string` to `object`) means we have to check every instance where that context is used
- Have to reference where the context is defined originally to figure out what properties it contains

Most or all of these issues are typical with any JavaScript application, not just ones that use Context. However, TypeScript can solve or mitigate all of these issues:

- Accessing a non-existent property in a context will cause a **compile error**, preventing any misuse of the context
- Renaming a property or changing the type of a property in the context will cause a **compile error**, if any code relied on the old name or type
- A typed context enables IDEs (like Visual Studio Code) to autocomplete what properties are available in a context

Furthermore, we don't incur any run-time cost for these benefits. That is, using TypeScript doesn't make our bundle size any larger because all of the types will be removed when compiled.

## How to use the React Context API with TypeScript

Let's revisit how we defined the theme context example earlier. Now we are going to add explicit types for the context.

```tsx
type ThemeContextValue = "light" | "dark";

const ThemeContext = React.createContext<ThemeContextValue>("light");
```

Now if we try to provide an invalid value to the context, the application will not compile.

```tsx
// ❌ This will NOT compile:
const App = () => (
  // ERROR: Type '"tomato"' is not assignable to type 'ThemeContextValue'
  //                     ⬇️
  <ThemeContext.Provider value="tomato">
    <CurrentThemeDisplay />
  </ThemeContext.Provider>
);
```

In addition, we are also prevented from misusing the value provided from the context. Here is a modified example of the `CurrentThemeDisplay`:

```tsx
// ❌ This will NOT compile:
const CurrentThemeDisplay = () => {
  const theme = React.useContext(ThemeContext);
  if (theme === "peach") {
    // ~~~~~~~~~~~~~~~~
    // ERROR: This condition will always return 'false' since the
    // types 'ThemeContextValue' and '"peach"' have no overlap.
    return "🍑 Peach";
  }
  return <div>{theme}</div>;
};
```

### How to provide default values to a React Context

As mentioned earlier, the `createContext` function requires that we pass a default value as the first argument. So, if we want to provide a default default, then we can just say:

```tsx
const defaultValue = { user: null };
const Context = React.createContext(defaultValue);
```

What if we don't want to provide a default value though? This may come up if we want to **require** that a provider is defined somewhere in our application. For example, maybe we want to fetch information from an API and use that as a default value.

To do this, we still have to provide a default value to `createContext`, but we can throw an error if there was no value in the context (which means that no provider was rendered).

#### Authentication context example

As an example, let's create an authentication context which tells the application about the current login state. Let's suppose that we want to enforce an authentication provider to exist.

```tsx
type User = { id: string; name: string };
type AuthContextValue =
  | { state: "logged-out" }
  | { state: "logged-in"; user: User };

const AuthContext = React.createContext<AuthContextValue | null>(null);
```

Then, where we consume the context, we can check if the value is `null`, and throw an error.

```tsx
const UserName = () => {
  const authState = React.useContext(AuthContext);
  if (authState === null) {
    throw new Error(
      "Authentication state not found. Try wrapping a parent component with <AuthContext.Provider>."
    );
  }
  return authState.state === "logged-out" ? "Anonymous" : authState.user.name;
};
```

Now if we try to render `<UserName />` without a `AuthContext.Provider`, an error will be thrown. The error message also includes what went wrong, explains how to fix the error: wrap a parent component with `AuthContext.Provider`.

<div class="note">
We also implicitly used another feature here of TypeScript here called <a href="https://www.typescriptlang.org/docs/handbook/2/narrowing.html">narrowing</a>. In combination with a <a href="https://en.wikipedia.org/wiki/Tagged_union"><abbr title="Also known as tagged unions">discriminated union</abbr></a>. Since we checked value of <code>state</code>, TypeScript was able to deduce that <code>authState.user</code> would always be defined in the other branch. If we had not properly checked this, TypeScript would not compile the code.
</div>

## How to write a TypeScript custom hook for a React Context

Now that we've explored how to add a type to the context, and enforce that a provider is used, it has become a bit cumbersome to actually use the context. We can fix that by creating a custom hook that calls `useContext` for us.

```tsx
const useUser = (): User | undefined => {
  const authState = React.useContext(AuthContext);
  if (authState === null) {
    throw new Error(
      "Authentication state not found. Try wrapping a parent component with <AuthContext.Provider>."
    );
  }
  return authState.state === "logged-in" ? authState.user : undefined;
};
```

Now, we have a reusable hook called `useUser` that lets us access the currently authenticated user from anywhere. It guarantees that we check there is an authentication provider, and also validates that we are logged in (using narrowing, which was discussed in the note above).

Now, the `UserName` component from before is much simpler:

```tsx
const UserName = () => {
  const user = useUser();
  return user ? "Anonymous" : user.name;
};
```

## Conclusion

Context is a simple, but powerful feature that can be used in any React project. In this post, we looked at the problems that Context solves, and how to use the React Context API to solve those problems. By adding TypeScript types, we can dramatically improve the type safety when using a context. Furthermore, we can also write a custom hook to ensure that we use the context consistently and safely, as well as make it easier to use.

If this guide helped you understand how to use React Context and TypeScript better, let me know and tweet me at <a href="https://twitter.com/cammchenry">@cammchenry</a>!
