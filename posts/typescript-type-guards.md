---
title: "TODO: Post about TypeScript Type Guards"
summary: "TODO: Summary"
publishedAt: "9999-01-01"
tags:
  - typescript
---

- TypeScript is useful because it enables us to write code that is safe
- When we know all of the types at compile-time, we can be sure that our code will not crash or cause errors.
- But what if we don't know all of the types at compile-time? Or if a value can have different types?
- To check types at run-time or differentiate between different types, we need to narrow the types using a type guard.

## What is narrowing?

- Narrowing is the process of using type guards to turn general types into more specific types.
- We can use narrowing to turn an `unknown` or `any` type into a more specific type (for example, parsing data from an API).
- We can use narrowing to turn a union of types into a single type (for example, `string | object | number` to `string`).
- We can use narrowing to turn a built-in type (like `string` or `number`) into a custom type like `NonEmptyString` or `PositiveNumber`.

## What is a type guard?

- Used to verify types at run-time and ensure safety at compile-time
- Essentially: run-time type checking

<https://www.typescriptlang.org/docs/handbook/2/narrowing.html>

## The kinds of type guards (how to check a type)

There are a number of type guards that are built into TypeScript that make it easy to narrow types just by writing typical JavaScript code. So, you may be using type guards without even realizing it!

Fundamentally, **every type guard relies on checking that some expression evaluates to true or false.**

So, the first kind of type guard which we will look at is just an `if/else` clause. But we can utilize more complex type guards like `in`, `typeof`, and `instanceof` that tell us much more information. In addition to all of these built-in type guards which utilize normal JavaScript behavior, we can can go even further and create our own custom type guards that can check _any type_.

### Boolean type guard

In a way, checking the boolean value (truthiness or falsiness) of something is the core of all type guards. All type guards depend evaluating an expression to a boolean value.

The difference between the "boolean type guard" and more complex type guards is that it allows us to infer more information with only a single check.

A boolean type guard only checks the truthiness of a value, but gives us no additional information beyond that. Other more complex type guards (which we will see shortly) can validate dozens of properties and methods with only a single type guard.

```typescript
function getAvailableRooms(rooms: number) {
  if (rooms) {
    return `There are ${rooms} hotel rooms available to book.`;
  }
  return "Sorry, all rooms are currently booked.";
}

getAvailableRooms(0); // "Sorry, all rooms are currently booked."
getAvailableRooms(5); // "There are 5 hotel rooms available to book."
```

<div class="note">
When using a boolean type guard, the value is implicitly casted to a boolean. This has a logical interpretation most of the time, but not always.

For example, if use a boolean type guard to check a type of `number | undefined`, we might expect that it will only exclude the `undefined` case. However, it will also rule out the case where the value is 0, which might not be what you expect. For more information on this common bug, check out Kent C. Dodd's article, [Use ternaries rather than && in JSX](https://kentcdodds.com/blog/use-ternaries-rather-than-and-and-in-jsx).

</div>

### Equality type guard

In the boolean type guard, we checked the _truthiness_ of an expression. **In an equality type guard, we check the _value_ of an expression.**

This kind of type guard is useful when we know all of the possible values of a type. For example, if we have an enumeration of string or number values, or if we want to know that a value is not `null` or `undefined`.

Here is an example where we use an equality type guard to _remove_ `undefined` from the type of a variable:

```typescript
function getGreeting(timeOfDay?: "morning" | "afternoon") {
  if (timeOfDay === undefined) {
    return `Hello!`;
  }
  // Now the type of `timeOfDay` is narrowed to `morning` | `afternoon`,
  // so we can use string methods on it safely.
  return `Good ${timeOfDay[0].toUpperCase()}${timeOfDay.slice(1)}!`;
}

getGreeting(); // "Hello!"
getGreeting("afternoon"); // "Good Afternoon!"
getGreeting("morning"); // "Good Morning!"
```

We can also use a `switch` block to accomplish exactly the same thing:

```typescript
function getGreeting(timeOfDay?: "morning" | "afternoon") {
  switch (timeOfDay) {
    case "afternoon":
    case "morning":
      return `Good ${timeOfDay[0].toUpperCase()}${timeOfDay.slice(1)}!`;
    default:
      return `Hello!`;
  }
}
```

Using a `switch` block like this might be preferable if you have a lot of possible values to check and which might share the same code.

TODO: Write about control-flow analysis?

### `typeof` type guard

In contrast to the previous example, where we checked the _value_ of a variable (or expression), with a `typeof` type guard, we check the _type_ of a variable.

When there is a value which has several possible types, like `string | number`, we can use `typeof` to figure out which type it is.

For example, we can use it to determine if a `string` was passed:

```typescript
function getDate(date: string | Date): Date {
  if (typeof date === "string") {
    return new Date(date);
  }
  return date;
}
```

The biggest limitation of the `typeof` guard is that it can only differentiate between [types that JavaScript recognizes](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/typeof). The types that `typeof` can check are:

- `boolean`
- `string`
- `number`
- `bigint`
- `object`
- `symbol`
- `function`
- `undefined`

### `instanceof` type guard

### `in` type guard

### User-defined type guard

## User-defined type guard function

- Examples:

  - `isValidElement`: <https://reactjs.org/docs/react-api.html#isvalidelement>
  - Checking a number is positive
  - Checking a string is a guid

- Pros:
  - Can create any kind of type, including custom types
  - Allows type-checking at run-time, ensuring that safety is ensured against data changing at run-time (for example: API returning different data)
- Cons:
  - Have to be manually written (cannot be done automatically currently)
  - Minor performance overhead
  - Can be implemented incorrectly, providing a false sense of security and safety
