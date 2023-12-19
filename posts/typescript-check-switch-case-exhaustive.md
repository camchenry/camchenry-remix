---
title: "How to check all cases were handled in a switch/case block in TypeScript"
summary: "In TypeScript, you can use the `never` type to check that all cases were handled in a switch/case block."
publishedAt: "2023-12-18"
tags:
  - typescript
type: til # 'guide' or 'post' or 'til'
published: true
---

Switch/case blocks can be a great way to handle multiple cases easily in a single function. However, it's easy to forget to handle all cases. Take this code for example:

```typescript
type DayOfWeek =
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday"
  | "Sunday";

function getWorkingHours(day: DayOfWeek): number {
  switch (day) {
    case "Monday":
    case "Tuesday":
    case "Wednesday":
    case "Thursday":
    case "Friday":
      return 8;
    case "Saturday":
      return 0;
    default:
      throw new Error(`Unhandled case: ${day}`);
  }
}
```

This may look correct at a quick glance, but it is incorrect because the `Sunday` case is not handled. If we call this function with `getWorkingHours("Sunday")`, it will throw an error.

It would be great if TypeScript could warn us about this. Luckily, it can! We can use the `never` type to check that all cases were handled. Here's how:

```typescript
type DayOfWeek =
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday"
  | "Sunday";

function getWorkingHours(day: DayOfWeek): number {
  switch (day) {
    case "Monday":
    case "Tuesday":
    case "Wednesday":
    case "Thursday":
    case "Friday":
      return 8;
    case "Saturday":
      return 0;
    default:
      const _exhaustiveCheck: never = day;
      throw new Error(`Unhandled case: ${day}`);
  }
}
```

Now, if we forget to handle a case, TypeScript will throw an error like:

```text
Type 'Sunday' is not assignable to type 'never'.
```

This is because the `never` type is a type that can never be assigned to anything. It is the natural result of a variable which contains no possible values. In this case, it results from the fact that we should have handled all possible values for `day`. If we forget to handle a case, TypeScript will throw an error because we are trying to assign a value to a variable of type `never`.

This is a great way to ensure that all cases are handled in a switch/case block in TypeScript and provides more safety in addition to throwing an error at runtime.

## Creating a helper function

If you find yourself using this pattern a lot, you can create a helper function to make it easier to use. Here's an example:

```typescript
function assertNever(x: never): never {
  throw new Error(`Unhandled case: ${x}`);
}
```

This is essentially a different way of asserting the same thing as the assignment to a variable of type `never` above. Now, instead of a variable assignment, we are asserting that the value passed into a function should be assignable to `never`. In either case, this code will throw an error when executed.

Now, we can use this function in our code like this:

```typescript
type DayOfWeek =
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday"
  | "Sunday";

function getWorkingHours(day: DayOfWeek): number {
  switch (day) {
    case "Monday":
    case "Tuesday":
    case "Wednesday":
    case "Thursday":
    case "Friday":
      return 8;
    case "Saturday":
      return 0;
    default:
      assertNever(day);
  }
}
```

## Fallthrough cases

In a similar vein, it's also a good idea to ensure that you don't accidentally fall through to the next case. For example, if you forget to add a `break` statement to the end of a case, it will automatically run the code of the next block down. This can be a source of bugs, so it's a good idea to ensure that you don't do this.

Thankfully, TypeScript has the [`noFallthroughCasesInSwitch` compiler option](https://www.typescriptlang.org/tsconfig/#noFallthroughCasesInSwitch) to help with this. If you enable this option, TypeScript will throw an error if you forget to add a `break` statement to the end of a case. Here's how to enable it:

```json
{
  "compilerOptions": {
    "noFallthroughCasesInSwitch": true
  }
}
```

## Further reading

- [TypeScript docs on the `never` type](https://www.typescriptlang.org/docs/handbook/2/functions.html#never)
- [`noFallthroughCasesInSwitch` compiler option](https://www.typescriptlang.org/tsconfig/#noFallthroughCasesInSwitch)
