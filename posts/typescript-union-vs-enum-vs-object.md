---
title: "The Difference Between TypeScript Unions, Enums, and Objects"
summary: "In this guide, we'll examine when you might want to use a union, enum, or object and the relative strengths and weaknesses of each feature, and see why unions and objects should be the backbone of most TypeScript projects."
publishedAt: "2022-04-30"
tags:
  - typescript
type: "guide"
published: false
---

When you first encounter unions and enums in TypeScript, you might wonder what the difference is between them. At first glance, they are very similar, but in fact they are quite different. The situation becomes even more complicated when we consider "constant objects" which are essentially another way to implement an enumeration.

In this article we'll look at their similarities and differences, and when you might want to use each of them.

## What are TypeScript unions?

I've already written a comprehensive article on [everything you need to know about union types](./typescript-union-type). In short, union types are a way of modeling a discrete set of mutually exclusive types, or more simply put: unions model choices, where _only one choice can be made_.

Union types are great because choices are _everywhere_ in the real world, so they are a powerful tool to allow TypeScript to programmatically reason about all possibilities that could result from different decisions.

This means that our code will be safer automatically because **TypeScript does all of the hard work of checking every possibility for us**.

## What are TypeScript enums?

Enums, short for enumerations, are a more traditional programming language feature in imperative languages like C/C++ and Java. Their purpose is similar to union types, except they act on a much more basic principle.

Enums give values (strings and numbers) a human-readable name that can be referenced easily in code via the name for the enumeration.

<div class="note">
Enums were added to TypeScript in anticipation of them becoming a standard JavaScript feature, however that currently seems unlikely based on the 4 year old <a href="https://github.com/rbuckton/proposal-enum">TC39 enum proposal</a> still being stuck at Stage 0.
</div>

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

#### Constant enums

It is also possible to define an `enum` as a [`const enum`](https://www.typescriptlang.org/docs/handbook/enums.html#const-enums) similar to the constant objects which we will talk about in this article. However, using `const enums` comes with some [pitfalls/caveats](https://www.typescriptlang.org/docs/handbook/enums.html#const-enum-pitfalls) which make them slightly more difficult to use in some cases. They don't offer a significant advantage over constant objects, so we won't discuss them in more detail here, but check out the [TypeScript documentation on `const enums`](https://www.typescriptlang.org/docs/handbook/enums.html#const-enums) for more info.

## What are TypeScript constant objects?

A constant object is no different from any other object in JavaScript, but when defined as `const` in TypeScript, it becomes a much stricter type. To create a constant object, we simply define an object and then add `as const` to make it a constant object.

Making it constant makes it act similar to enum, and it can be used in almost the same way. Let's look at the previous `enum` example, but now using an object with `as const`:

```typescript
const DayOfWeek = {
  Monday: 0,
  Tuesday: 1,
  Wednesday: 2,
  Thursday: 3,
  Friday: 4,
  Saturday: 5,
  Sunday: 6,
} as const;
```

Using `as const` makes all of the properties `readonly`, so the values are not allowed to be changed in the type system. So, all of the keys and values are guaranteed to never change as long as we abide by the type system, just like an `enum`.

Now that we are a little bit familiar with unions, enums, and constant objects, let's compare them with each other and see how they stack up.

## Comparison between unions, enums, and constant objects

To help you decide whether to use a union, enum, or object, I've created a table that summarizes the key similarities and differences:

| Feature                   | Unions                 | Enums                  | Constant objects       |
| ------------------------- | ---------------------- | ---------------------- | ---------------------- |
| Strictly typed            | ✅ Yes                 | ✅ Yes                 | 🟡 Partial<sup>1</sup> |
| Available at compile-time | ✅ Yes                 | ✅ Yes                 | ✅ Yes                 |
| Available at run-time     | ❌ No                  | ✅ Yes                 | ✅ Yes                 |
| Named values              | 🟡 Partial<sup>2</sup> | ✅ Yes                 | ✅ Yes                 |
| Unique values             | ✅ Yes                 | ❌ No                  | ❌ No                  |
| Sub-typing                | ✅ Yes                 | 🟡 Partial<sup>3</sup> | 🟡 Partial<sup>3</sup> |
| Mixed types               | ✅ Yes                 | 🟡 Partial<sup>4</sup> | ✅ Yes                 |
| Computed values           | 🟡 Partial<sup>5</sup> | ❌ No                  | ✅ Yes                 |
| Reverse mappings          | ❌ No                  | ✅ Yes                 | ❌ No                  |

1. Constant objects cannot be used directly as types, but it is simple to create a type of the key values:

   ```typescript
   type Key = keyof typeof ConstantObject;
   ```

2. Unions can emulate named values when the values are strings, by making the value the same as the name. For example:

   ```typescript
   enum Dimension {
     X = "x",
     Y = "y",
     Z = "z",
   }

   // can be written as:
   type Dimension = "x" | "y" | "z";
   ```

3. Only keys can be easily derived, the values are not possible to subtype.

4. Enums do not support mixed types within each state other than strings and numbers, such as objects, booleans, etc. (For example: you cannot use an enum to refer to an object value, even if it is constant.)

5. Unions allow strings to be interpolated into them, but the interpolation will be interpreted as a [template literal type](https://www.typescriptlang.org/docs/handbook/2/template-literal-types.html). If the interpolated value is a union, multiple possibilities will be generated. If the interpolated value is a string, only one possibility will be generated.

## Unions, enums, and constant objects all support type safety

Regardless of which language feature you choose, the one thing they share in common is static type safety. We can create additional types that derive from a union, enum, or object. This helps us lean into leveraging the full power of the TypeScript compiler and make our code safer and reduce the amount of work a developer needs to do.

## Unions and enums are both strictly typed

The advantage of using a union or an enum over a more generic type like `string` is that the number of possible values is much lower and is enforced by the compiler. Rather than allowing _all_ strings or _all_ numbers, we can reduce it to just a _few_ strings or a _few_ numbers.

The TypeScript compiler ensures that we cannot make any spelling mistakes in values because all of the possibilities are known. Using `string` or `number` does not provide the same guarantees. So, unions and enums help make the code safer by automatically preventing simple typing mistakes.

## What's similar between enums and constant objects

Enums are constant objects are very similar, and so they are many properties in common:

- ⭐️ **Run-time usable**: Enums and objects can be used while the program is running (for example, to build a selection menu UI)
- **Named values**: Both can give given names or aliases to specific values.
- **No uniqueness**: Both do _not_ enforce uniqueness of values. There may be duplicate values.
- **Partial sub-typing**: Both only support sub-typing on the keys, not the values.

### Both: named values

Another unique advantage of enums and objects is that keys and values can be named independently. This is great for improving the readability of code, essentially creating two sets: human-readable names, and machine-readable values.

This is good if you don't control the values, but want to give them understandable names. For example, using an enum or object to identify pin numbers for microchips:

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

```typescript
const Pin = {
  Power: 0,
  LED0: 4,
  LED1: 5,
  Button1: 8,
  Button2: 3,
  Ground: 1,
} as const;
```

This is one of the advantages of using an enum or object instead of a union type, because union types cannot be referred to by name, only by their value.

### Both: run-time usability

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
// Or:
const Color = {
  Red: "Red",
  Green: "Green",
  Blue: "Blue",
} as const;

// Note: `Color` _does_ exist as an actual value at run-time,
// so we can use it just like any object:
console.log(Object.values(Color));
// => ["Red", "Green", "Blue"]
```

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

Using many different kinds of types brings some challenges, such as how to differentiate between them. To learn more on how to differentiate between types in a union, check out my complete guide on [TypeScript type guards](./typescript-type-guards).

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

## Unique advantage of enums: reverse mapping

The main advantage that enums have over unions and constant objects is that the values are automatically mapped to their names, as well as the reverse: names can be mapped to values. This can be useful when it is necessary to often go between the names and values often. For example, let's use the `Pin` enum from before:

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

We can easily answer two questions with the `enum`:

- What is the purpose of pin `0`?

  ```typescript
  const purpose: string = Pin[0]; // => "Power"
  ```

- What pin number corresponds to `Ground`?

  ```typescript
  const ground: number = Pin.Ground; // => 1
  ```

However, two things diminish the usefulness of this:

1. This feature can be replicated with objects when it is needed.
2. If we don't need the reverse mapping, this results in useless code being generated. This can bloat the JavaScript bundle size significantly depending on how many enums are used in a project.

## Unique advantage of constant objects: computed values

One unique advantage of constant objects that can be helpful in some circumstances is that it is possible to used computed values as keys or values. For example, suppose we have an object which resolves theme values for whether we should show a light or dark-mode color scheme. In addition to the base keys and values, we can also create other dynamically computed values:

```typescript
const defaultColorScheme: string = "light";
const lightAlias: string = "day";
const darkAlias: string = "night";

const ColorScheme = {
  default: defaultColorScheme,
  light: "light",
  dark: "dark",
  [lightAlias]: "light",
  [darkAlias]: "dark",
} as const;
```

We still retain the type safety of saying `ColorScheme.light` or `ColorScheme.dark` but can also use it in dynamic circumstances to find `ColorScheme.default` or `ColorScheme[usedSpecifiedTheme]`.

This is the type that TypeScript ultimately resolves for this object:

```typescript
const ColorScheme: {
  readonly [x: string]: string;
  readonly default: string;
  readonly light: "light";
  readonly dark: "dark";
};
```

It's not perfect, but at least it is possible to use computed values if necessary.

---

## What type should I use?

We've looked at a lot of examples and caveats of unions, enums, and objects. So, let's wrap things up by looking at a subjective opinion of what type I recommend you should use depending on the circumstances.

If you just want a quick summary:

- **Use union types as a default**
- **Use constant objects for run-time purposes**
- **Avoid using `enum` if possible**

### When should you use a union in TypeScript

As a general guide, union types might be a good choice to use if many of the following apply:

- You have a known set of possible values
- The values are self-descriptive
- All of the values must be unique
- The values are only needed at compile-time (i.e., not used in the output)

### When should you use a constant object in TypeScript

Constant objects could be a good choice if several of the following apply to the situation:

- You have a known set of possible values
- The values don't correspond to their name
- The values are used in the output (for example, a selection menu or printed to the screen)
- The keys or values can be dynamic

### When should you use an enum in TypeScript: probably never

Besides automatically doing reverse mapping (which can actually be a disadvantage), there are not enough benefits to justify using an enum over a constant object. Using a constant object over an enum will result in a smaller bundle size, and more flexibility with being able to use dynamic values and interoperate with standard JavaScript syntax.

Enums were added to TypeScript in anticipation of them becoming a standard JavaScript feature, however it seems extremely unlikely that will happen anytime soon, or ever (see: [TC39 proposal](https://github.com/rbuckton/proposal-enum)). As such, they have not seen many language improvements in the last few years.

## Conclusion

Hopefully this guide helped clear up the confusion between enums and unions, and made the advantages and disadvantages between enums, unions, and constant objects clear. However, enums are somewhat lackluster when compared to the other two, and probably should not be used in most cases. On the other hand, unions and constant objects work together very well and can be used together, or independently, in a broad set of situations to implement mutual exclusivity in TypeScript programs.

Good luck and happy coding!
