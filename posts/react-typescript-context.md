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

Imagine a context like a wireless network, where the provider is a 🌐 WiFi router, and the consumer is a device like a 💻 laptop.

A laptop that is connected to the network is like a consumer component that is nested under the provider. As long as the
laptop is connected, it can communicate and receive data regardless of where it is physically located. In the same way, as long as a consumer is under the provider, it can exist anywhere in the component tree and access state directly.

Similarly, a laptop always tries to find the closest access point in order to get the best signal possible. This is like the behavior of the consumer, which always reads the value of the nearest (least nested) provider.

### How do we define a context?

- React.createContext
- React.useContext

- Two parts (potentially two components):
  - Consumer
  - Provider
- Consumer can access the state given by the Provider.
  - The state is read from the closest provider in the tree.
- When the Provider state changes, the entire tree under the Provider updates.

### A note about class-based Context

- There is a class-based method of using Context
- We will not cover that because Hooks is a much simple API (and easier to reuse/compose too)

## How TypeScript helps us work with contexts

- TypeScript doesn't provide any run-time benefits (since it compiles away)
- Provides autocompletion in IDE for what type of state is available in a context
- Can type check the state of the context

## How to use the React Context API with TypeScript

- Create context type
- Create context variable (null)

### How to consume values from a context

- Create hook to use the context (for convenience)

### How to provide default values to a React Context

- Create context with a value rather than null

### How to update values in a context with `useState`

- In addition to the context value, include a function to update the state

## How to write a TypeScript custom hook for a React Context

- useXYZ hook
  - Assert not null
  - Include nice error message for future developers
  - guarantees that the context is used correctly

## Conclusion

If this guide helped you understand how to use React Context and TypeScript better, send me a tweet!
