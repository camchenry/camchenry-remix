---
title: "How to pick and omit keys in TypeScript"
summary: "Learn how to exclude and include properties from objects or arrays of objects in TypeScript as well as JavaScript."
publishedAt: "2023-10-06"
tags:
  - javascript
  - typescript
type: guide # 'guide' or 'post' or 'til'
published: true
---

Objects are one of the most commonly used parts of JavaScript. As a result, they are appear frequently in web applications, especially in UI applications when using libraries like React, because they are used for storing state and props. Knowing how to quickly slice and dice objects in many different ways is an extremely useful skill to have.

In this article, we're going to look at a particular kind of object manipulation: excluding or including properties ("keys") in an object. In TypeScript, this is done using the `Pick` and `Omit` utility types and allows you to change the type that represents an object. In JavaScript, we will create our own `pick` and `omit` functions that will allow us to do the same thing but to actual objects. Let's dive in!

## Contents

## Pick

In this guide, a "pick" refers to choosing some number of properties from an object and creating a new object with only those properties. A pick is the opposite of an [omit](#omit).

### What is the `Pick` utility type?

TypeScript has a native way to represent the pick operation using the `Pick` utility type. If you are interested in how it is defined by TypeScript, check out my [guide on TypeScript Utility Types](/blog/typescript-utility-types#picktype-keys). In practice, it can be used like this:

```ts
type User = {
  id: number;
  name: string;
  email: string;
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

- [Lodash.pick](https://lodash.com/docs/4.17.15#pick)
- [Ramda.pick](https://ramdajs.com/docs/#pick)

### Examples of how to use `Pick`

#### How to pick a single key/property from an object

With our `pick` function, we can easily extract a single key from an object:

```ts
const user: User = {
  id: 1,
  name: "Grace Hopper",
  email: "gracehopper@example.com",
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
// => { name: "Curry", ingredients: ["rice", "chicken", "vegetables", "spices"] }
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
// => { name: string, ingredients: string[] }
```

#### How to pick a single key/property from an array of objects

Picking a single key from each object in an array is similar to picking a single key from an object, but now we have to iterate over the array:

```ts
const users: User[] = [
  {
    id: 1,
    name: "Grace Hopper",
    email: "gracehopper@example.com",
  },
  {
    id: 2,
    name: "Alan Turing",
    email: "alanturing@example.com",
  },
];
const userNames = users.map((user) => pick(user, ["name"]));
// => [{ name: "Grace Hopper" }, { name: "Alan Turing" }]
```

For the type version, we can use the `Pick` utility type and the `number` index type:

```ts
type Users = {
  id: number;
  name: string;
  email: string;
}[];
type UserNames = Pick<Users[number], "name">[];
// => { name: string }[]
```

#### How to pick multiple keys/properties from an array of objects

Once again, picking multiple keys from an array of objects is nearly identical to getting a single key. We just have to iterate and pass more properties/keys:

```ts
const users: User[] = [
  {
    id: 1,
    name: "Grace Hopper",
    email: "gracehopper@example.com",
  },
  {
    id: 2,
    name: "Alan Turing",
    email: "alanturing@example.com",
  },
];
const userNamesAndEmails = users.map((user) => pick(user, ["name", "email"]));
// => [{ name: "Grace Hopper", email: "gracehopper@example.com" },
//     { name: "Alan Turing", email: "alanturing@example.com" }]
```

And the types-only version (assuming we are given an array type) is:

```ts
type Users = {
  id: number;
  name: string;
  email: string;
}[];
type UsersWithNameAndEmail = Pick<Users[number], "name" | "email">[];
```

## Omit

In this post, an "omit" refers to an operation where we exclude some number of properties from an object and create a new object that contains all the other properties. An omit is the opposite of a [pick](#pick).

### What is the `Omit` utility type?

The way to represent an exclusion of object keys in TypeScript is with the `Omit` utility type. If you are interested in how it is defined internally by TypeScript, check out my [guide on TypeScript Utility Types](/blog/typescript-utility-types#omittype-keys). In practice, it is used like so:

```ts
type User = {
  id: number;
  name: string;
  email: string;
  password: string;
};

// We don't want to leak the password in the type! Let's omit it.
type PublicUser = Omit<User, "password">;
// => { id: number, name: string, email: string }
```

It is useful for removing properties from types which are forbidden our should be inaccessible. Note that this does _not_ actually remove the properties from the object, it just changes the type of the object. To actually remove properties from an object, we will need to use a custom `omit` function.

### The `omit` function for omitting keys/properties from an object

The `Omit` type is useful for changing the type of an object, but if we want to actually remove properties from an object (for example, so they don't leak sensitive data), then we need to define a function to do that. We can create a custom `omit` function that will take an object and a list of keys and return a new object with all the keys except the ones we want to omit.

```ts
function omit<Data extends object, Keys extends keyof Data>(
  data: Data,
  keys: Keys[]
): Omit<Data, Keys> {
  const result = { ...data };

  for (const key of keys) {
    delete result[key];
  }

  return result as Omit<Data, Keys>;
}
```

Again, I recommend using a more robust implementation in your own applications, this simple code will suffice for the rest of this guide. However, library implementations will likely have more features like being able to omit nested keys, omitting keys from arrays, and more.

Recommended library implementations:

- [Lodash.omit](https://lodash.com/docs/4.17.15#omit)
- [Ramda.omit](https://ramdajs.com/docs/#omit)

### Examples of how to use `Omit`

#### How to omit a single key/property from an object

Using the `omit` function, we can remove a single key from an object:

```ts
const user: User = {
  id: 1,
  name: "Grace Hopper",
  email: "gracehopper@example.com",
  password: "verysecure",
};
const publicUser = omit(user, ["password"]);
// => { id: 1, name: "Grace Hopper", email: "gracehopper@example.com" }
```

If we just want to omit properties from a type, we can use the `Omit` utility type instead:

```ts
type User = {
  id: number;
  name: string;
  email: string;
  password: string;
};
type PublicUser = Omit<User, "password">;
// => { id: number, name: string, email: string }
```

#### How to omit multiple keys/properties from an object

We can also omit multiple keys from an object:

```ts
const website = {
  name: "My Website",
  url: "https://example.com",
  owner: "Grace Hopper",
  ownerAddress: "123 Main St",
};
const publicWebsiteInfo = omit(website, ["name", "url"]);
// => { name: "My Website", url: "https://example.com" }
```

Like before, it is almost exactly the same for a type:

```ts
type Website = {
  name: string;
  url: string;
  owner: string;
  ownerAddress: string;
};
type PublicWebsiteInfo = Omit<Website, "name" | "url">;
// => { name: string, url: string }
```

#### How to omit a single key/property from an array of objects

By now, you may be able to see the pattern: omitting a single key from an array of objects is much like omitting a single key from an object, but we are iterating over an array:

```ts
const websites: Website[] = [
  {
    name: "My Website",
    url: "https://example.com",
    owner: "Grace Hopper",
    ownerAddress: "123 Main St",
  },
  {
    name: "My Other Website",
    url: "https://example.com",
    owner: "Alan Turing",
    ownerAddress: "456 Main St",
  },
];
const websitesWithoutAddress = websites.map((website) =>
  omit(website, ["ownerAddress"])
);
// => [{ name: "My Website", url: "https://example.com", owner: "Grace Hopper" },
//     { name: "My Other Website", url: "https://example.com", owner: "Alan Turing" }]
```

For the type version, we can use the `Omit` utility type and the `number` index type again:

```ts
type Websites = {
  name: string;
  url: string;
  owner: string;
  ownerAddress: string;
}[];
type WebsitesWithoutAddress = Omit<Websites[number], "ownerAddress">[];
// => { name: string, url: string, owner: string }[]
```

#### How to omit multiple keys/properties from an array of objects

To omit multiple keys from an array of objects, we just need to iterate over the array and pass more keys:

```ts
const websites: Website[] = [
  {
    name: "My Website",
    url: "https://example.com",
    owner: "Grace Hopper",
    ownerAddress: "123 Main St",
  },
  {
    name: "My Other Website",
    url: "https://example.com",
    owner: "Alan Turing",
    ownerAddress: "456 Main St",
  },
];
const publicWebsiteList = websites.map((website) =>
  omit(website, ["ownerAddress", "owner"])
);
// => [{ name: "My Website", url: "https://example.com" },
//     { name: "My Other Website", url: "https://example.com" }]
```

And the types-only version (assuming we are given an array type) is:

```ts
type Websites = {
  name: string;
  url: string;
  owner: string;
  ownerAddress: string;
}[];
type PublicWebsiteList = Omit<Websites[number], "ownerAddress" | "owner">[];
// => { name: string, url: string }[]
```

## Conclusion

I hope this guide has helped you understand how to pick and omit keys from objects in TypeScript and JavaScript and given you some examples which may be helpful in building some applications. Happy coding!
