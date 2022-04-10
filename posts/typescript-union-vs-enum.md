---
title: "The Difference Between TypeScript Unions and Enums"
summary: "TODO: Summary"
publishedAt: "9999-01-01"
tags:
  - typescript
type: "guide"
published: false
---

Unions and enums seem very similar, and in fact they accomplish the same ideas. In this article we'll look at how they are the same, how they are different, and when you might use each of them. They are not opposed to each other, they can be used together.

## What are TypeScript unions?

I've already written a comprehensive article on [everything you need to know about union types](./typescript-union-type). In short, union types are a way of modeling a discrete set of mutually exclusive types, or more simply put: unions model choices, where _only one choice can be made_.

Union types are great because choices are _everywhere_ in the real world, so they are a powerful tool to allow TypeScript to programmatically reason about all possibilities that could result from different decisions.

This means that our code will be safer automatically because **TypeScript does all of the hard work of checking every possibility for us**.

## What are TypeScript enums?

Enums, short for enumerations, are a more traditional programming language feature in imperative languages like C/C++ and Java. Their purpose is similar to union types, except they act on a much more basic principle.

Enums give values (strings and numbers) a human-readable name that can be referenced easily in code via the name for the enumeration.

### TypeScript enum example

To make this more clear, let's look at a simple example of an enum. Suppose that we are building an application that models the days of the week as numbers (0 through 6). Instead of needing to remember what the number for each day of the week is, we can create an enum that stores that information:

```typescript
enum DayOfWeek {
  Monday = 0,
  Tuesday = 1,
  Wednesday = 2,
  Thursday = 3,
  Friday = 4,
  Saturday = 5,
  Sunday = 6,
}
```

Now, instead of needing to type the numbers each time, we can use the enum instead:

```typescript
function isWeekend(day: DayOfWeek) {
  return day === DayOfWeek.Saturday || day === DayOfWeek.Sunday;
}
```

Using enums in this case makes our code easier to read and prevents simple typos.

Now that we understand unions and enums, let's consider why we would want to choose one over the other.

## Comparison between unions and enums

To help you decide whether to use a union or an enum, I've created a table that summarizes the key similarities and differences:

| Feature                   | Unions                 | Enums                  |
| ------------------------- | ---------------------- | ---------------------- |
| Strictly typed            | ✅ Yes                 | ✅ Yes                 |
| Available at compile-time | ✅ Yes                 | ✅ Yes                 |
| Available at run-time     | ❌ No                  | ✅ Yes                 |
| Named values              | 🟡 Partial<sup>1</sup> | ✅ Yes                 |
| Unique values             | ✅ Yes                 | ❌ No                  |
| Sub-typing                | ✅ Yes                 | 🟡 Partial<sup>2</sup> |
| Mixed types               | ✅ Yes                 | 🟡 Partial<sup>3</sup> |
| Computed values           | 🟡 Partial<sup>4</sup> | ❌ No                  |

1. Unions can emulate named values when the values are strings, by making the value the same as the name. For example:

   ```typescript
   enum Dimension {
     X = "x",
     Y = "y",
     Z = "z",
   }

   // can be written as:
   type Dimension = "x" | "y" | "z";
   ```

2. Only keys of an enum can be easily derived, the values are not possible to subtype.

3. Enums do not support mixed types within each state other than strings and numbers, such as objects, booleans, etc. (For example: you cannot use an enum to refer to an object value, even if it is constant.)

4. Unions allow strings to be interpolated into them, but the interpolation will be interpreted as a [template literal type](https://www.typescriptlang.org/docs/handbook/2/template-literal-types.html). If the interpolated value is a union, multiple possibilities will be generated. If the interpolated value is a string, only one possibility will be generated.

## What's similar between unions and enums

There are a few commonalities between unions and enums in TypeScript:

- **Strictly typed**: Both can be used to only allow specific values and prevent typos
- **Statically typed**: Both can be used at compile time to create other types.

### Both: strictly typed

The advantage of using a union or an enum over a more generic type like `string` is that the number of possible values is much lower and is enforced by the compiler. Rather than allowing _all_ strings or _all_ numbers, we can reduce it to just a _few_ strings or a _few_ numbers.

The TypeScript compiler ensures that we cannot make any spelling mistakes in values because all of the possibilities are known. Using `string` or `number` does not provide the same guarantees. So, unions and enums help make the code safer by automatically preventing simple typing mistakes.

### Both: statically typed

As an additional benefit of using enums and unions, we can create additional types that derive from a union or enum. This helps us lean into leveraging the full power of the TypeScript compiler and make our code safer and reduce the amount of work a developer needs to do.

One caveat is that enum values aren't able to be extracted into a type, so unions and generally easier to work with in this regard.

## Advantages of union types

There are several advantages to using union types in TypeScript:

- **Unique values**: Unions automatically simplify values to be unique
- ⭐️ **Mixed types**: Unions can represent more kinds of types like objects, arrays, booleans, and so on.
- **Sub-typing**: Unions support creating subtypes easily
- **Computed types**: Unions have partial support for dynamic values, limited to the possibilities of template literal types.

### Union advantage: unique values

Unlike enums, values in a union represent a set, which is a collection of unique values. So, if any values are repeated, then they will only appear once in the resulting type. For example, `type N = 1 | 2 | 3 | 1 | 2 | 3` simplifies to just `N = 1 | 2 | 3`.

### Union advantage: mixed types

One of the most important properties of unions is that they can contain all different kinds of types, not just strings and numbers. For example, this is a perfectly valid union which would be impossible to represent with an enum:

```typescript
type SomeUnionOfTypes =
  | "this is a string" // string
  | 1234 // number
  | { this_is: "an object" } // object
  | Array<unknown>; // array (object)
  | true; // boolean
```

Using many different kinds of types brings some challenges, such as how to differentiate between them. To learn more on how to differentiate betwen types in a union, check out my complete guide on [TypeScript type guards](./typescript-type-guards).

### Union advantage: sub-typing

Another great benefit of union types is that they can be easily transformed into other types. For example, we can use union types to generate a large set of possible values:

```typescript
type Direction = "top" | "right" | "left" | "bottom";
type Property = "margin" | "padding";

type Properties = `${Property}-${Direction}`;
// => "margin-top" | "margin-right" | "margin-left"
//  | "margin-bottom" | "padding-top" | "padding-right"
//  | "padding-left" | "padding-bottom"
```

Or values can be narrowed down to just a subset:

```typescript
type Direction = "top" | "right" | "left" | "bottom";

type VerticalDirection = Pick<Direction, "top" | "bottom">;
type HorizontalDirection = Omit<Direction, VerticalDirection>;
```

### Union advantage: computed types

Neither enums nor unions have full support for dynamic values, but unions do have some partial support for dynamic value in the form of template literal types. Values can be interpolated in to a union, like so:

```typescript
type Color = "red" | "green" | "blue";
type ColorDeclaration = `color: ${Color};`;
// => "color: red;" | "color: green;" | "color: blue;"
```

To some degree, types can be interpolated in even if they are dynamic also, but little inference is possible, so type safety is somewhat limited:

```typescript
type NamedValue = "red" | "green" | "blue";
type Value = string | NamedValue;
type Declaration = `color: ${Value};`;
// => `color: ${string};`;
```

Using the dynamic input eliminates the previous type safety that was given by knowing all of the possible values. On the other hand, this does allow us to represent dynamic values to at least some degree.

Enums do not support computed values or computed keys, so this is a uniquely union type advantage.

## Advantages of enums

Compared to union types, enums have a few distinct advantages:

- ⭐️ **Run-time usable**: Enums can be used at run-time and at compile-time, so the values/types can be used during execution (for example, to build a selection menu UI)
- **Named values**: Enum values can be named independently of the value

### Enum advantage: run-time usability

The biggest advantage of using an enum is that they exist even after code is compiled, while the program is running. This is because enums are ultimately generated as normal JavaScript objects.

This can be helpful when it is necessary to have the benefits of type safety and compile time, while also remembering the set of values while the program is running.

Union types cannot be used as values, and cannot be used in executable code:

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

### Enum advantage: named values

Another unique advantage of enums is that keys and values can be named independently. This is great for improving the readability of code, essentially creating two sets: human-readable names, and machine-readable values.

This is good if you don't control the values, but want to give them understandable names. For example, using an enum to identify pin numbers for microchips:

```typescript
enum Pin {
  Power = 0,
  LED0 = 4,
  LED1 = 5,
  Button1 = 8,
  Button2 = 3,
  Ground = 1,
}
```

This is one of the advantages of using enums instead of a union type, because union types cannot be referred to by name, only by their value.

## When should you use a union in TypeScript

As a general guide, union types might be a good choice to use if many of the following apply:

- You have a known set of possible values
- The values are self-descriptive
- ...

## When should you use an enum in TypeScript

Enums might be a good tool to use when many of the following are true:

- You have a known set of possible values
- The values are not within your control
- ...

## Conclusion

Hopefully this guide helped make the differences (and similarities!) between enums and unions in TypeScript more clear. They can be used together, or independently, to implement mutual exclusivity in TypeScript programs.

Good luck and happy coding!
