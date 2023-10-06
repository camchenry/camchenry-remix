---
title: "How to pick and omit keys in TypeScript"
summary: "TODO: Summary"
publishedAt: "2023-10-06"
tags:
  - typescript
type: guide # 'guide' or 'post' or 'til'
published: false
---

Objects are one of the most commonly used parts of JavaScript. As a result, they are appear frequently in web applications, especially in UI applications when using libraries like React, because they are used for storing state and props. Knowing how to quickly slice and dice objects in many different ways is an extremely useful skill to have.

In this article, we're going to look at a particular kind of object manipulation: excluding or including properties ("keys") in an object. In TypeScript, this is done using the `Pick` and `Omit` utility types and allows you to change the type that represents an object. In JavaScript, we will create our own `pick` and `omit` functions that will allow us to do the same thing but to actual objects. Let's dive in!

## Pick

In this guide, a "pick" refers to choosing some number of properties from an object and creating a new object with only those properties.

### What is the `Pick` utility type?

TypeScript has a native way to represent the pick operation using the `Pick` utility type. If you are interested in how it is defined by TypeScript, check out my [guide on TypeScript Utility Types](/blog/typescript-utility-types#picktype-keys). In practice, it can be used like this:

```ts
type User = {
  id: number;
  name: string;
  email: string;
  password: string;
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
};

type BasicUserInfo = Pick<User, "id" | "name">;
// => { id: number, name: string }
```

### The `pick` function for picking keys/properties from an object

With the `Pick` type we can create a new type that represents an object with only the keys we want. However, we want to actually create objects with only the keys we want, not just types. To do this, we can create a custom `pick` function that will take an object and a list of keys and return a new object with only those keys.

```ts
function pick<Data extends object, Keys extends keyof Data>(
  data: Data,
  keys: Keys[]
): Pick<Data, Keys> {
  const result = {} as Pick<Data, Keys>;

  for (const key of keys) {
    result[key] = data[key];
  }

  return result;
}
```

I recommend using a more robust implementation in your own applications, but we will use this simple implementation for the rest of this guide. However, library implementations will likely have more features like being able to pick nested keys, picking keys from arrays, and more.

Recommended library implementations:

- [lodash.pick](https://lodash.com/docs/4.17.15#pick)
- [ramda.pick](https://ramdajs.com/docs/#pick)

### Examples of how to use `Pick`

#### How to pick a single key/property from an object

With our `pick` function, we can easily extract a single key from an object:

```ts
const user: User = {
  id: 1,
  name: "Grace Hopper",
  email: "gracehopper@example.com",
  password: "da39a3ee5e6b4b0d3255bfef95601890afd80709",
  address: {
    street: "123 Example Ave",
    city: "New York",
    state: "NY",
    zip: "12345",
  },
};
const userWithName = pick(user, ["name"]);
// => { name: "Grace Hopper" }
```

If we just want to pick properties from a type, we can use the `Pick` utility type instead:

```ts
type User = {
  id: number;
  name: string;
  email: string;
  password: string;
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
};
type UserWithName = Pick<User, "name">;
// => { name: string }
```

#### How to pick multiple keys/properties from an object

It is also simple to get multiple keys from an object:

```ts
const food = {
  name: "Curry",
  servings: 2,
  calories: 500,
  ingredients: ["rice", "chicken", "vegetables", "spices"],
};

const foodIngredients = pick(food, ["name", "ingredients"]);
```

If we just want to pick properties from a type, we can use the `Pick` utility type instead:

```ts
type Food = {
  name: string;
  servings: number;
  calories: number;
  ingredients: string[];
};
type FoodIngredients = Pick<Food, "name" | "ingredients">;
```

#### How to pick a single key/property from an array of objects

#### How to pick multiple keys/properties from an array of objects

## Omit

### What is the `Omit` utility type?

### The `omit` function for omitting keys/properties from an object

### Examples of how to use `Omit`

#### How to omit a single key/property from an object

#### How to omit multiple keys/properties from an object

#### How to omit a single key/property from an array of objects

#### How to omit multiple keys/properties from an array of objects
