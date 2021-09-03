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

- The Two Worlds model (as the name suggests) consists of two different sets of things:
  - "JavaScript world"
  - "TypeScript world"
- Although TypeScript is described on [typescriptlang.org](https://typescriptlang.org) as "JavaScript and More" I find it helpful to consider them as two separate languages for this mental model.
- That means we can think of the Two Worlds model as something like a Venn diagram:

  ```
   ┌────────────┬─────────┬───────────┐
   │            │         │           │
   │            │         │           │
   │ JavaScript │ Defs.   │ TypeScript│
   │            │         │           │
   │            │         │           │
   └────────────┴─────────┴───────────┘
  ```

- In this model, the JavaScript parts and TypeScript parts are totally separate, except for some small overlap, which is what allows us to use TypeScript in JavaScript practically.
- For now, let's ignore the overlapping region and focus on each world separately.

### The JavaScript World

- The JavaScript World
  - So, what's in this "JavaScript world" set?
  - Well, it is all the JavaScript syntax and features you are probably familiar with and feel comfortable using:
    - Values
    - Functions
    - Conditional logic (`if/else`, `while`, `for`, ...)
    - Operators (`+`, `!`, `??`, ...)
    - etc.

### The TypeScript World

- For many, the TypeScript World is arcane and inaccessible. It contains things like:
  - Types
  - Generics
  - Conditional types
  - Union types & intersection types
  - etc.
- Understanding all of these concepts is important for using TypeScript to the fullest, but learning all of these new things is overwhelming.
- It is especially overwhelming if you've never used TypeScript, or you're a busy professional with lots of things going on.
- In most cases, when these types and concepts become too complicated, that's when we resort to `any` because it makes the code compile. That's OK, but I am going to give you the simple secret to understanding the relationship between the "TypeScript World" and the "JavaScript World."

### The relationship between TypeScript and JavaScript

- The key is: **Most concepts in JavaScript have a corresponding and equivalent concept in TypeScript.**
- This statement is abstract, so let's look at a simple example.

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

    TypeScript:

    ```typescript
    type Identity<Value> = Value;
    ```

    This creates a **generic type** called `Identity`, which accepts a type variable called `Value` and returns it.

  - From this, we get a few simple mappings:
    - "generic type" <=> "function"
    - "type variable" <=> "type variable"

- Conclusion
