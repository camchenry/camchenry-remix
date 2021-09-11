---
title: "TODO: Draft Post"
summary: "TODO: Summary"
publishedAt: "9999-01-01"
tags:
  - TODO
---

## Introduction

- Introduction
  - Many people find TypeScript frustrating.
    1. It adds a lot of new syntax on top of what JavaScript already has (generics, type annotations, casting, etc.)
    2. If TypeScript is just JavaScript, why not use JavaScript?
  - While I can't address every concern with TypeScript, let's focus on the confusion around understanding types.
  - Many developers have resorted (myself included) to simply using `any` instead of a more specific type, because it seems there is just no way to appease the compiler.
  - In this article, we will look at the "two worlds" model of TypeScript, which will help us understand how TypeScript and JavaScript work together, and will make understanding complex TypeScript a little bit easier.

## The Two Worlds Model

- The Two Worlds model is a mental model that consists of two distinct parts:
  - The run-time world ("JavaScript world")
  - The compile-time world ("TypeScript world")
- Although TypeScript is described on [typescriptlang.org](https://typescriptlang.org) as "JavaScript and More" I find it helpful to consider them as two separate languages for this mental model.
- In this model, the JavaScript parts and TypeScript parts are totally separate, except for some small overlap, which is what allows us to use TypeScript in JavaScript practically.
- It's important to note that this is a **mental model**. That means this is a tool for organizing our thoughts. It does not describe how TypeScript or JavaScript in detail, but when confronted with new concepts it gives us a framework to understand them.
- For now, let's ignore the overlapping region and focus on each world separately.

### The run-time world

- The run-time world
  - So, what's in this "JavaScript world" set?
  - Well, it is all the JavaScript syntax and features you are probably familiar with and feel comfortable using:
    - Values
    - Functions
    - Conditional logic (`if/else`, `while`, `for`, ...)
    - Operators (`+`, `!`, `??`, ...)
    - etc.

### The compile-time world

- For many, the compile-time world feels inaccessible. It has concepts like:
  - Types
  - Generics
  - Conditional types
  - Union types & intersection types
- Understanding all of these concepts is important for using TypeScript to the fullest, but learning all of these new things can be overwhelming.
- It is especially overwhelming if you've never used TypeScript, or you're a busy professional with lots of things going on.
- In most cases, when these types and concepts become too complicated, that's when we resort to `any` because it makes the code compile. That's OK, but I am going to give you the simple secret to understanding the relationship between the run-time world and the compile-time world.

### The relationship between TypeScript and JavaScript

- The key is: **Most run-time concepts have a corresponding and equivalent concept at compile-time.**
- Let's make this more concrete by looking at a simple example.

  ```typescript
  const x = 5;
  ```

  - This is a standard variable declaration which creates a binding between a **value** (`5`) and a name `x`. That means we can refer to `5` by saying `x` instead.
  - So, what does the TypeScript world equivalent of this look like?

    ```typescript
    type x = 5;
    ```

  - This is is a standard type declaration which creates a binding between a **type** (`5`) and a name `x`.
  - That's the same definition as before, except we used the term **type** instead of **value**.
  - That leads us to the first important mapping between TypeScript and JavaScript: **types** in TypeScript are the equivalent of **values** in JavaScript.

- Another important mapping is: **generics** are the equivalent of **functions** in JavaScript.

  - Example:

    JavaScript:

    ```typescript
    const identity = (value) => value;
    ```

    This creates a **function** called `identity`, which accepts an argument called `value` and returns it.

    TypeScript:x

    ```typescript
    type Identity<Value> = Value;
    ```

    This creates a **generic type** called `Identity`, which accepts a type variable called `Value` and returns it.

- In the same manner, we can construct many examples of JavaScript features that have an equivalent TypeScript feature.
- Examples:

  - Values <=> Types
  - Functions <=> Generics
  - If/else <=> Conditional Types
  - ...

### How does this help us?

So now that we understand that almost all features in JavaScript can be modeled in TypeScript, how does this help us? Well, many developers reach for `any` as a stop-gap solution to just make the code compile, but let's look at some examples where we can use a more specific type and leverage TypeScript to its fullest.

#### Example 1: Mapped Types

- Conclusion
