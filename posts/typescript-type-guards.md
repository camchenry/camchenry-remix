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
- Uses a mechanism called control-flow analysis.
- We can use narrowing to turn an `unknown` or `any` type into a more specific type (for example, parsing data from an API).
- We can use narrowing to turn a union of types into a single type (for example, `string | object | number` to `string`).
- We can use narrowing to turn a built-in type (like `string` or `number`) into a custom type like `NonEmptyString` or `PositiveNumber`.

## What is a type guard?

- Used to verify types at run-time and ensure safety at compile-time
- Essentially: run-time type checking

<https://www.typescriptlang.org/docs/handbook/2/narrowing.html>

## Where can a type guard be used?

- `if/else`
- ternary operator
- `switch`
- `while`
- Aliased conditions (since TS 4.4, <https://devblogs.microsoft.com/typescript/announcing-typescript-4-4/#cfa-aliased-conditions>)

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

[//]: # "TODO: This would be a good place to talk about discriminated unions, or link to an article"

<div class="note">
Discriminated unions deserve their own article, but they are essentially a more powerful version of the equality type guard.

A discriminated union is a type that has multiple possible types, with a field that allows to us to discriminate (or differentiate) between them. In other words, when we check the value of a single field (like `type`), it automatically includes a number of other properties.

</div>

### `typeof` type guard

In contrast to the previous example, where we checked the _value_ of a variable (or expression), with a `typeof` type guard, we check the _type_ of a variable.

When there is a value which has several possible types, like `string | number`, we can use `typeof` to figure out which type it is.

For example, we can use `typeof` to write a comparison function that compares two values to each other and returns the difference:

```typescript
function compare(a: number | string, b: number | string): number {
  if (typeof a === "number" && typeof b === "number") {
    // Both a and b are numbers, so we can compare them directly.
    return a - b;
  }
  if (typeof a === "string" && typeof b === "string") {
    // We can use string methods on `a` and `b` safely.
    return a.localeCompare(b);
  }
  throw new Error(
    `Cannot compare unrelated types '${typeof a}' and '${typeof b}'`
  );
}

compare("a", "b"); // => -1
compare("b", "a"); // => 1
compare(123, 321); // => -198
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

When we have a variable that is an instance of a class, we can use `instanceof` to check whether if the variable has that type or not.

For example, the DOM APIs define many classes and subclasses which can be quickly checked using `instanceof`:

```typescript
function handleEvent(event: Event) {
  if (event instanceof MouseEvent) {
    // `event` now has type `MouseEvent`, so we can access mouse-specific properties
    console.log(`A mouse event occured at (${event.x}, ${event.y}`);
  }
  if (event instanceof KeyboardEvent) {
    // `event` now has type `KeyboardEvent`, so we can access key-specific properties
    console.log(`A keyboard event occurred: ${event.key} ${event.}`);
  }
  console.log("An event occurred: ", event.type);
}
```

This is useful when dealing with potentially generic DOM objects, because a single `instanceof` check grants access to all of the properties and methods of the class.

This can also be used to differentiate between common objects in JavaScript, like `Map`, `Date`, `Array`, or `Set`. For example, we can create a function to create a lookup table which accepts many possible inputs:

```typescript
// Creates a Map which returns some value given a string key
// (ignoring the fact that the Map constructor already accepts some of these)
function createLookupTable<Value>(
  db: [string, Value][] | Map<string, Value> | Record<string, Value>
): Map<string, Value> {
  // `db` has type `[string, Value][] | Map<string, Value> | Record<string, Value>`
  if (db instanceof Array) {
    // `db` now has type `[string, Value][]`
    return new Map(db);
  }
  // `db` has type `Map<string, Value> | Record<string, Value>`
  if (db instanceof Map) {
    // `db` now has type `Map<string, Value>`
    return db;
  }
  // `db` has type `Record<string, Value>`
  return new Map(Object.entries(db));
}

createLookupTable([
  ["hat", 14.99],
  ["shirt", 24.95],
]);
// => Map (2) {"hat" => 14.99, "shirt" => 24.95}

createLookupTable(
  new Map([
    ["hat", 14.99],
    ["shirt", 24.95],
  ])
);
// => Map (2) {"hat" => 14.99, "shirt" => 24.95}

createLookupTable({ hat: 14.99, shirt: 24.95 });
// => Map (2) {"hat" => 14.99, "shirt" => 24.95}
```

Here is another example using `instanceof` to check if a type is a `Date` or a `string` and decide whether to construct a new `Date` object or not:

```typescript
function getDate(value: string | Date): Date {
  if (value instanceof Date) {
    return value;
  }
  return new Date(value);
}

getDate("2021-05-06 03:25:00");
// => Date: "2021-05-06T07:25:00.000Z"
getDate(new Date("2021-05-06 03:25:00"));
// => Date: "2021-05-06T07:25:00.000Z"
```

### `in` type guard

The `in` type guard allows us to differentiate between multiple types by checking if an object has a specific property. In JavaScript, the `in` operator, like all type guards, returns a boolean value that indicates if the object has the property or not. For example,

```typescript
"data" in { name: "test", data: { color: "blue" } }; // => true
"data" in { name: "test", data: undefined }; // => true
"data" in { name: "test" }; // => false
```

In this way, we can use `in` to differentiate objects that have different sets of properties. For example, we can use it to differentiate between different types of classes (in this case, events):

```typescript
function handleEvent(event: MouseEvent | KeyboardEvent) {
  if ("key" in event) {
    // event now has type `KeyboardEvent`
    console.log(`A keyboard event occurred: ${event.key}`);
  } else {
    // event now has type `MouseEvent`
    console.log(`A mouse event occurred: ${event.button}`);
  }
}
```

The important thing here is that `key` is only defined for `KeyboardEvent`, but not for `MouseEvent`. If the property we check exists in multiple cases, the narrowing will not work. For example, the following code will not work:

```typescript
type EventInput =
  | { type: "mouse"; button: string }
  | { type: "key"; key: string };

function handleEventInput(event: EventInput) {
  // This type guard will NOT work:
  if ("type" in event) {
    // event still has type `EventInput`, so the type guard does not
    // do any narrowing in this case
  }
}
```

<div class="note">
Though not always related to its use for narrowing types, the `in` operator is also often used to check for browser support of certain features.

For example, the guard `'serviceWorker' in navigator` checks whether the browser supports service workers.

</div>

### Assertion type guard (or assertion function)

In TypeScript 3.7, TypeScript added support for [assertion functions](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-7.html#assertion-functions). An assertion function is a function that assumes a condition is always true, and throws an error when it does not.

To create an assertion function, we need to add something called an "assertion signature," which is a formal declaration of what the function will assert. The assertion signature is additional information about a function (like a return type) that lets the TypeScript compiler narrow the type.

Let's look at an example:

```typescript
function assertString(value: unknown): asserts value is string {
  if (typeof value !== "string") {
    throw new TypeError(`Expected 'string', got: '${typeof value}'`);
  }
}

const x = "123";
assertString(x);
// x now has type 'string', so it is safe to use string methods
x.toLowerCase();
```

<div class="note">
Previously, we discussed how all type guards are based around a boolean check. That is still true in this case, but the actual usage is slightly different from other type guards.

With other type guards, we typically used something like `if` or `switch` to create different branches of execution. With an assertion function, the two branches are: continue as normal, or stop the script (throw an error).

</div>

Other than the difference of how an assertion type guard can throw an exception, assertion type guards are similar to other type guards. However, something that we must be careful about is accidentally creating a type guard which asserts the **wrong** condition.

This is one way that we can end up with a **false sense of safety**. Here is an example where the function asserts something, but the actual code asserts nothing.

```typescript
function assertString(value: unknown): asserts value is string {
  // This check does not match the assertion signature
  if (typeof value === "boolean") {
    throw new TypeError();
  }
}

const x: unknown = 123;
assertString(x);
// We get a run-time exception here (!!!), which TypeScript should
// be able to prevent under normal circumstances:
x.toLowerCase();
// "TypeError: x.toLowerCase is not a function"
```

### User-defined (custom) type guard

Most type guards have limitations to what they can check, such as only primitive types for `typeof`, or only classes for `instanceof`. But with user-defined type guards, there are no limitations on what we can check.

**Custom type guards are the most powerful kind of type guard**, because we can verify any type, including ones that we defined ourselves, as well as built-in types from JavaScript or the DOM. The main downside of custom type guards is that they are not predefined, so we have to write them ourselves.

There are a few built-in custom type guards though, such as [`Array.isArray`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/isArray):

```typescript
const data: unknown = ["a", "b", 123, false];
if (Array.isArray(data)) {
  // data now has type "array", so it is safe to use array methods
  data.sort();
}
```

In the next section, we will look at all of the different ways that we can define our own type guard functions.

## Type guard functions

A type guard function is a function that returns a value and has a _type predicate_.

A type predicate is an additional declaration that is added to a functon (like a return type) which gives additional information to TypeScript and allows it to narrow the type of a variable. For example, in the definition of `Array.isArray`,

```typescript
function isArray(arg: any): arg is any[];
```

the type predicate is `arg is any[]`. In spoken word, the signature of this function might be: "`isArray` takes one argument of type `any` and checks if it is an array." In general, type predicates take the form: `variable is type`.

For a function to be eligible as a type guard, it must:

- Return a boolean value
- Have a type predicate

The type predicate replaces the return type, because a function with a type predicate must always return a boolean value.

### Examples of type guard functions

#### Check if a value is a string

This example is essentially a reusable form of the built-in `typeof` type guard.

```typescript
function isString(value: unknown): value is string {
  return typeof value === "string";
}
```

#### Check if a value is defined (not null or undefined)

```typescript
function isNotNullOrUndefined<Value>(
  value: Value | undefined | null
): value is Value {
  return value !== null && value !== undefined;
}
```

#### Check if a number is positive

#### Check if a string is a GUID

#### Check if a value is a valid React element (`React.isValidElement`)

The [`isValidElement`](https://reactjs.org/docs/react-api.html#isvalidelement) function included with React checks if a value is a valid React element, which can be rendered by React.

```typescript
function isValidElement<P>(
  object: {} | null | undefined
): object is ReactElement<P>;
```

The implementation of this function is not relevant, but it is a perfect example of a type guard function that verifies a completely custom type that cannot be verified with other type guards.

### Pros and cons of custom type guard functions

The advantages of custom type guard functions are:

- **Flexibility**: can check any type, including custom types that we define
- **Run-time type checking**: allows type-checking at run-time, ensuring that safety is ensured both when code is compiled, and also when it is running
- **Reusable**: type guard functions allow us to combine multiple type guards into one and easily use them in multiple places

The disadvantages of a custom type guard function are:

- **Manual**: type guard functions have to be written manually (currently no automatic way to generate type guards)
- **Performance**: using type guard functions has a slight overhead to call the function and run the checks (negligible in practice)
- **Fragile**: custom type guards can be implemented incorrectly on accident, which may provide a false sense of security and safety

## Conclusion

### Summary
