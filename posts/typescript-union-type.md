---
title: "TODO: Draft Post about TypeScript Union Types"
summary: "TODO: Summary"
publishedAt: "9999-01-01"
tags:
  - typescript
---

Programming with types is all about modelling systems. And systems are full of mutually exclusive decisions: this or that, one or none, on or off, yes or no, and so on.

## What is a union type in TypeScript?

A union type (or "union" or "disjunction") is a set of types that are mutually exclusive. The type represents all of the possible types simultaneously. A union type is created with the union operator `|`, by listing out each type and separating them with a pipe character.

The union type provides more information to the TypeScript compiler that allows it to **prove code is safe _for all possible situations_**, which is a powerful tool. We may not know whether the user will pass a `string`, `number`, or `object` to a function, but we can guarantee that every case is handled without needing to write any unit tests to check that.

### Examples of union types

In the DOM, we can only store strings for values, or numbers as strings. So, the only acceptable types for a DOM value are essentially a string or a number. (This is exactly the definition of the `ReactText` type).

```typescript
// Acceptable DOM values
type Value = string | number;
```

Similarly, DOM events are always happen independently of each other (events are processed one at a time). So, there is a finite list of possible events that can be processed:

```typescript
type Event = MouseEvent | KeyboardEvent; /* and so on */
```

We can also use a union type to represent a subset of primitive types like `string` or `number`.

```typescript
type DayOfWeek =
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday"
  | "Sunday";
```

```typescript
type NumberOfColumns = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
```

### When should you use a union type?

Union types are a perfect fit for a situation where we know exactly what all of the possible states are, but we don't know when we compile the program which one will be used. For example, we could use union types to store:

- days of the week,
- color palettes,
- columns of a database table
- [DOM event names](https://developer.mozilla.org/en-US/docs/Web/Events),
- [finite state machine](https://en.wikipedia.org/wiki/Finite-state_machine) states

As a counterexample, something like a person's name is not a good fit for a union type, because there are essentially an infinite (or very large) number of possible states.

## How to tell which type is currently in use

Of course, it's great that we can model mutually exclusive states with union types, but how do we actually use them? How do we make sense of a union and figure out which specific case we have?

We can differentiate between types in a union with a type guard. A **type guard** is a conditional check that allows us to differentiate between types. And in this case, a type guard lets us figure out exactly which type we have within the union.

There are multiple ways to do this, and it largely depends on what types are contained within the union. I cover this topic in much more detail here on my [post about type guards](https://camchenry.com/blog/typescript-type-guards).

However, **there is a shortcut to making differentiating between types in a union easy**.

Enter discriminated unions.

## What is a discriminated union?

A **discriminated union** (also called "distinguished union" or "tagged union") is a special case of a union type that allows us to easily differentiate between the types within it.

This is accomplished by adding a field to each type which a unique value, which can be used to differentiate between the types using an equality type guard.

For example, if we had a type which represented possible events that could occur, we could give each event a unique type. Then, we just need to check the event type to know exactly what case we are handling.

```typescript
type AppEvent =
  | { kind: "click"; x: number; y: number }
  | { kind: "keypress"; key: string; code: number }
  | { kind: "focus"; element: HTMLElement };

function handleEvent(event: AppEvent) {
  switch (event.kind) {
    case "click":
      // We know it is a mouse click, so we can access `x` and `y` now
      console.log(`Mouse clicked at (${event.x}, ${event.y})`);
      break;
    case "keypress":
      // We know it is a key press, so we can access `key` and `code` now
      console.log(`Key pressed: (key=${event.key}, code=${event.code})`);
      break;
    case "focus":
      // We know it is a focus event, so we can access `element`
      console.log(`Focused element: ${event.element.tagName}`);
      break;
  }
}
```

## When should you _not_ use a union type?

- When you can use a generic instead to avoid needing to use a type guard (i.e., it is knowable at compile time)

## What is the difference between an `enum` and a union type?

- Compile-time vs run-time
  - An enum exists after compiling the program, and can be iterated over while running the program
  - Union types only exist at compile-time
  - If you want to convert a union type to an array, then you might want to use an `enum` potentially, or discriminated unions.
- Values vs types
  - An enum is a set of mutually exclusive **values** (either `string` or `number`)
  - A union type is a set of mutually exclusive **types** (which can be anything)

## How to get a single type from a union type

<https://www.typescriptlang.org/docs/handbook/utility-types.html#extracttype-union>

## How to get a subset of a union type

<https://www.typescriptlang.org/docs/handbook/utility-types.html#excludetype-excludedunion>

## Additional resources

- <https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#union-types>
