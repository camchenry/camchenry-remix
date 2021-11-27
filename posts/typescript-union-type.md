---
title: "Everything You Need To Know About TypeScript Union Types"
summary: "Union types are a powerful feature of TypeScript to ergonomically model a finite number of mutually exclusive cases and ensure that every case is handled safely."
publishedAt: "2021-11-27"
tags:
  - typescript
---

Programming in TypeScript is all about creating models that help us to write safe code. Among those models, union types are one of the most useful, because they allow us to model mutually exclusive states like: low, medium, or high, one or none, on or off, and so on. In this article, I'll teach you what a union type is, when to use it, and tips on how to use it effectively.

## What is a union type in TypeScript?

A [union type](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#union-types) (or "union" or "disjunction") is a set of types that are mutually exclusive. The type represents all of the possible types simultaneously. A union type is created with the union operator `|`, by listing out each type and separating them with a pipe character.

```typescript
type Union = "A" | "B" | "C";
```

The union type provides more information to the TypeScript compiler that allows it to **prove code is safe _for all possible situations_**, which is a powerful tool. We may not know whether the user will pass a `string`, `number`, or `object` (for example) to a function, but we can guarantee that every case is handled without needing to write any unit tests to check that.

### When should you use a union type?

Union types are a perfect fit for a situation where we know exactly what all of the possible states are, but we don't know when we compile the program which one will be used. For example, we could use union types to store:

- days of the week,
- color palettes,
- columns of a database table
- [DOM event names](https://developer.mozilla.org/en-US/docs/Web/Events),
- [finite state machine](https://en.wikipedia.org/wiki/Finite-state_machine) states

As a counterexample, something like a person's name is not a good fit for a union type, because there are essentially an infinite (or very large) number of possible states.

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

For example, we could write some business logic functions that only accept days of the week:

```typescript
type DayOfWeek =
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday"
  | "Sunday";

function isBusinessDay(day: DayOfWeek): boolean {
  return day !== "Saturday" && day !== "Sunday";
}

isBusinessDay("Monday"); // => true
isBusinessDay("Saturday"); // => false
isBusinessDay("Whensday");
//             ^^^^^^^^ ERROR: Argument of type '"Whensday"'
// is not assignable to parameter of type 'DayOfWeek'
```

If **every type in the union is the same**, then we can use functions and operators as expected on those types.

```typescript
type NumberOfColumns = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

function getColumnWidth(totalWidth: number, columns: NumberOfColumns) {
  return `${(totalWidth / columns).toFixed(2)}px`;
}

getColumnWidth(1920, 6); // => "320.00px"
getColumnWidth(1920, 16);
//                   ^^ ERROR: Argument of type '16' is not
// assignable to parameter of type 'NumberOfColumns'
```

If the types are different (which is most of the time), then we cannot simply call functions on them or use arithmetic operators. We need to differentiate between the types in the union.

## How to tell which type is currently in use

Of course, it's great that we can model mutually exclusive states with union types, but how do we actually use them? What if every type is not the same? How do we make sense of a union and figure out which specific case we have?

We can differentiate between types in a union with a type guard. A **type guard** is a conditional check that allows us to differentiate between types. And in this case, a type guard lets us figure out exactly which type we have within the union.

There are multiple ways to do this, and it largely depends on what types are contained within the union. I cover this topic in much more detail here on my [post about type guards](https://camchenry.com/blog/typescript-type-guards).

However, **there is a shortcut to making differentiating between types in a union easy**.

Enter discriminated unions.

## What is a discriminated union?

A **discriminated union** (also called "distinguished union" or "tagged union") is a special case of a union type that allows us to easily differentiate between the types within it.

This is accomplished by adding a field to each type that has a unique value, which can be used to differentiate between the types using an equality type guard.

For example, if we had a type which represented all possible events that could occur, we could give each event a unique name. Then, we just need to check the event name to know exactly what type/case we are handling.

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

In this example, the advantage is that we can have completely disparate types in our union, and easily handle each case with just a single `if` check. This lends itself well to extension, because we can easily add new events and new cases to our application and lean on TypeScript to ensure that we don't forget to handle them.

## How to get a single type from a union type

Sometimes, we want to deal with just a single type from union type, or a subset of the types. Thankfully, TypeScript provides a built-in utility type called [`Extract`](https://www.typescriptlang.org/docs/handbook/utility-types.html#extracttype-union) to _extract_ a single type from a union type.

Using the `DayOfWeek` type from before, we can extract individual days from the type:

```typescript
type DayOfWeek =
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday"
  | "Sunday";

type BusinessDay = Extract<
  DayOfWeek,
  "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday"
>;
// => "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday"
type Weekend = Extract<DayOfWeek, "Saturday" | "Sunday">;
// => "Saturday" | "Sunday"
```

This might seem redundant, but the advantage is that we are deriving types based on our `DayOfWeek` type. So, if the base type ever changes, we can be sure that all of our types are still valid.

But, `Extract` is more powerful than just extracting a single type. It can extract all **assignable types** from a union type.

```typescript
// Type for a configuration value that can be defined in multiple ways:
// either as a single value (string or number), array of values, or an object.
type Value = string | number;
type Config = Value | Array<Value> | Record<string, Value>;

// Only config values that are assignable to objects will have this type
type Objects = Extract<Config, object>;
// => Value[] | Record<string, Value>
```

## How to get a subset of a union type

We saw that `Extract` can be used to a subset of a union type, but only for a few specific types. When we want to extract most types, we can use the complement of `Extract` type, which is `Exclude`.

In TypeScript, we can use the [`Exclude`](https://www.typescriptlang.org/docs/handbook/utility-types.html#excludetype-excludedunion) type to get all types from a union type, except for those that are assignable to another union.

For example, let's redefine our types derived from `DayOfWeek` to use `Exclude` instead:

```typescript
type BusinessDay = Exclude<DayOfWeek, "Saturday" | "Sunday">;
// => "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday"
type Weekend = Exclude<
  DayOfWeek,
  "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday"
>;
// => "Saturday" | "Sunday"
```

These types are exactly the same as the ones we defined before, but we defined them using `Exclude` instead of `Extract`.

### When to use `Extract` or `Exclude`

For the most part, `Extract` and `Exclude` are interchangeable, they are just complements of each other. So the general rule for when to use them is:

- Use `Extract` when you only need to extract **a few types** from a union type
- Use `Exclude` when you need to extract **most types** from a union type

Both of these types become even more powerful when we leverage each of their respective strengths. For example, we can redefine our day of the week types to use `Extract` and `Exclude` in combination:

```typescript
type Weekend = Extract<DayOfWeek, "Saturday" | "Sunday">;
// => "Saturday" | "Sunday"

type BusinessDay = Exclude<DayOfWeek, Weekend>;
// => "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday"
```

This version is both much shorter (so it is easier to read) and it also better conveys the meaning and intention behind the types.

## When should you _not_ use a union type?

Although union types are an excellent modeling tool, there are legitimate reasons to _not_ use them:

- **When the types are known at compile-time**, we can use [generics](https://www.typescriptlang.org/docs/handbook/2/generics.html) instead to provide further type safety and flexibility. If the types are known ahead of time, then there is no need to use a union type.
- **When we need to enumerate all possibilities at run-time** (use an [`enum`](https://www.typescriptlang.org/docs/handbook/enums.html) instead for this). For example, if we wanted to iterate over all of the days of the week and construct an array, we would need to use an `enum`, because union types are a TypeScript-only feature, so it is compiled away when compiling to JavaScript.

## What is the difference between an `enum` and a union type?

At first, an `enum` and a union appear to be almost the same, so what's the difference? The two main differences between an `enum` and unions are:

- A union type exists only at compile-time, an `enum` exists at compile-time and run-time.
- A union type is an enumeration of any kind of type, an `enum` is an enumeration of only strings or numbers.

Of these differences, the one that has the most important practical implications is that unions only exist in TypeScript's type system, while an `enum` actually exists as an object in JavaScript. Unions are a convenient way to model many types, but they do not actually affect the program's execution in any way. So, when we compile TypeScript to JavaScript, the union type will disappear from the code.

```typescript
type Color = "Red" | "Green" | "Blue";

// Note: `Color` does not exist at run-time, so we
// cannot do something like this:
console.log(Object.values(Color));
//                        ^^^^^ ERROR: 'Color' only refers
// to a type, but is being used as a value here
```

On the other hand, an `enum` is essentially an alias for a JavaScript object. It is both a type and a value at the same time, similar to how a class can act as both a type and an actual value in JavaScript.

```typescript
enum Color {
  Red,
  Green,
  Blue,
}

// Note: `Color` _does_ exist as an actual value at run-time,
// so we can use it just like any object:
console.log(Object.values(Color));
// => ["Red", "Green", "Blue"]
```

So, if it is necessary to be able to iterate over all the possible values and use the values in our program, then an `enum` might be a better choice instead.

## Conclusion

Union types are a fantastic feature of TypeScript. They are an ergonomic way to model a finite number of mutually exclusive cases, and allow new cases to be added without breaking any existing code. However, union types do not exist at compile-time, so any programs that need access to the enumerated values should probably use an `enum` instead.

If you're interested in learning more about union types and the theory behind them, check out these additional resources:

- [Union types (TypeScript Handbook)](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#union-types)
- [Algebraic data types (Wikipedia)](https://en.wikipedia.org/wiki/Algebraic_data_type)
- [Tagged union (Wikipedia)](https://en.wikipedia.org/wiki/Tagged_union)

If this post helped you understand union types better, consider sending me a message to me ([@cammchenry](https://twitter.com/cammchenry)) and let me know what you thought. Happy coding!
