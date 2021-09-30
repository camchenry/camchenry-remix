---
title: "How to power up the React Context API with TypeScript"
summary: "TODO: Summary"
publishedAt: "9999-01-01"
tags:
  - typescript
  - react
---

## What is the React Context API?

- React.createContext
- React.useContext

### A note about class-based Context

- There is a class-based method of using Context
- We will not cover that because Hooks is a much simple API (and easier to reuse/compose too)

### What problems does React Context solve?

- Context helps to pass a piece of global state to an entire render tree.
  - That is, any component under a context can access its state and will be rerendered when the context changes.
  - Pro: It prevents having to pass the same prop in many different components
  - Pro: By not requiring props to be passed, the component can be used more flexibly
  - Con: Since the component _requires_ context, it must always be wrapped

### How does context work?

- Two parts (potentially two components):
  - Consumer
  - Provider
- Consumer can access the state given by the Provider.
  - The state is read from the closest provider in the tree.
- When the Provider state changes, the entire tree under the Provider updates.

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
