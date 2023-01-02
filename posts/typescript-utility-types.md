---
title: "A Complete Guide to TypeScript Utility Types"
summary: "Utility types are pre-defined types that are included in TypeScript by default to help with common typing tasks. In this article, we will see how utility types can be used to manipulate unions, objects, strings, and other types."
publishedAt: "2023-01-02"
tags:
  - typescript
type: guide # 'guide' or 'post' or 'til'
published: false
---

## What are utility types?

Utility types are helpers provided automatically by TypeScript to make common typing tasks easier. Since they are standard across _all_ TypeScript codebases, they are sort of like the "standard library of TypeScript."

TypeScript lets you define [reusable types via the `type` keyword](https://www.typescriptlang.org/docs/handbook/declaration-files/by-example.html#reusable-types-type-aliases). There is nothing special about most utility types, almost all of the types are reusable types that happen to be automatically included with every TypeScript installation. All of the definitions for each utility type are freely available on GitHub.

There are a few exceptions to the above, where the types cannot be reproduced since they are built into the TypeScript compiler, such as [`ThisType`](#thistypetype).

## Value transformation types

### `Awaited<Type>`

The `Awaited` type takes a type that is a `Promise` and returns the type that the `Promise` resolves to, mimicking the behavior of the `await` keyword. The `Awaited` utility type is [defined as](https://github.com/microsoft/TypeScript/blob/12d7e4bdbf98a877d27df6e8b072d663c839c0b8/lib/lib.es5.d.ts#L1530-L1539):

```typescript
type Awaited<Type> = Type extends null | undefined
  ? Type
  : Type extends object & { then(onfulfilled: infer OnFulfilled): any }
  ? OnFulfilled extends (value: infer Value, ...args: any) => any
    ? Awaited<Value>
    : never
  : Type;
```

For example, if you have a `Promise` that resolves to a `string`, you can use `Awaited` to get the type of the resolved value:

```typescript
type Value = Awaited<Promise<string>>; // Value: string
```

The `Awaited` type will also recursively unwrap nested `Promise`s. If a type is not a Promise, it will be left as-is.

```typescript
type Nested = Awaited<Promise<Promise<string>>>; // X: string
type NonAsync = Awaited<string>; // NonAsync: string
```

For clarity, compare the behavior of `Awaited` with the parallel behavior of `await` in JavaScript:

```typescript
type Value = Awaited<Promise<string>>; // => string
const value: Value = await Promise.resolve("string"); // => "string" (string)

type Nested = Awaited<Promise<Promise<number>>>; // => number
const nested: Nested = await Promise.resolve(Promise.resolve(123)); // => 123 (number)

type NonAsync = Awaited<string>; // => string
const nonAsync: NonAsync = await "test"; // => "test" (string)
```

- [TypeScript documentation on `Awaited`](https://www.typescriptlang.org/docs/handbook/utility-types.html#awaitedtype)
- [Try out these examples in TypeScript Playground](https://www.typescriptlang.org/play?#code/IYZwngdgxgBAZgV2gFwJYHsIwLbFRACgEoYBvAWACgYZkwAHAUxgDVgAbBZgXhgEEA7nmSMAJgB4ACgCd02VCEbiQyafgDmAPk0wA9LpjcdKtRHVUaUTCpgA3DlwBcrBzxjAhqZDBlyFjADppRhB0dltGAgByEw0oogsYKwhQ9kD2dHUCe05GBMpEuiYYADkQkVFDfk8KqVl5RTq-RogEbAAjRmltHX1DHVaOrsTkmwhysWcylTEqj2Efev8gkLCIgl8GwODU9YBGACYAZiJ8y2sw9MyCcZnRfMKGZhLMPnBoKsFhMWVVDV6DEYYLEzCNrN4IK93lAplDILBeFERCoomCUpcAhkspCIG94fkAL5UKi4fDEKhAA)

## Object manipulation types

### `Partial<Type>`

The `Partial` type takes an object type and makes all of its properties optional. The `Partial` utility type is [defined as](https://github.com/microsoft/TypeScript/blob/12d7e4bdbf98a877d27df6e8b072d663c839c0b8/lib/lib.es5.d.ts#L1546-L1551):

```typescript
type Partial<Object> = {
  [Property in keyof Object]?: Object[Property];
};
```

For example, it can be used to create a function that takes an object with a subset of the properties of an existing object:

```typescript
type User = {
  name: string;
  email: string;
  phone: string;
};

const updateUserDetails = (user: User, newDetails: Partial<User>) => ({
  ...user,
  ...newDetails,
});

const user = { name: "Ada", email: "ada@lovelace.com", phone: "3214567890" };
const updatedUser = updateUserDetails(user, { email: "ada@example.com" });
// => { name: "Ada", email: "ada@example.com", phone: "3214567890" }
```

```typescript
type Preferences = {
  theme: "light" | "dark";
  language: string;
  allowMotion: boolean;
};

const userPreferences: Partial<Preferences> = {
  theme: "dark",
};
```

One important thing to note is that this does not work recursively, so only the first level of an object will be made partial:

```typescript
type UserWithAddress = {
  name: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
};

const addressableUser: Partial<UserWithAddress> = {
  // ERROR: Missing the following properties: city, state, zip
  address: {
    street: "123 Example St",
  },
};
```

In the example above, `name`, `email`, and `phone` are all optional, but all of the properties in `address` are still required.

- [TypeScript documentation on `Partial`](https://www.typescriptlang.org/docs/handbook/utility-types.html#partialtype)
- [Try out these examples in TypeScript Playground](https://www.typescriptlang.org/play?#code/IYZwngdgxgBAZgV2gFwJYHsIwLbFRACgEoYBvAWACgYZkwAHAUxgFURGAnGAXjKppoRg2RgC4YIZB3wBzANz8BjXKgA24ydIjzFNegAtMYiVNkLqMAL7nFUTJJgJ6AE2DJGbTgBFGyPKpAeGAIEdg5xTw4AGhgIRgB3Hz81EHEABWAONGBVAB5IgD4SbgLg0hgAOirQzhiqirjE339AyyIqW3tkRzCg8qERcQByAEFXIZjlf2HgVwABVXQAN0ZVYChGCrtsCZgDI2GAZgAmAEYAFgBWADYAdgAOAE4ABiGrTogHJ1d3Z0ig75uDxhJItEJhGLlKZqGbzRgAD2E9FUm22bzaHUomJodCYMDSHEYcE4jGgjECvAoFhx+mUxgARKpUDJ9Mh6TAAD4wemuDgAa3p5gEMDW2gQwBkxk0Zl0MByi3iAFl0GhMOIAEbodAo4AQIVWGwWOyfbo1DgEokksmpfGZbJ5C3EwnW0qU2XIWmDbm8gVRWWimTiyXiemk+l+izWbG0BjMSIAdVQHrGzkJIApfGpsWEUtM2n1NGh6hMWh0Wf2cQ0ebLwtmqfJNqpwpomkYvirpYLAigSbAHZlWZbfnc-fzspoAC9UPRRzWBFHI-rjQ462mQMB1SjIuk7agcvkwonk856+nXZnhQB6S8wACiACV7wB5e-iRWodOyWi0+DahVf+gOHQJgslQclxB7OgYkkIEYinehZVXBtxCbZtW3bblTmOQ470RbBkWYABlNlZUsRQyMoCjMRUQh2koIA)

### `Required<Type>`

The `Required` utility type accepts an object type and makes all of its properties required. The `Required` utility type is [defined as](https://github.com/microsoft/TypeScript/blob/12d7e4bdbf98a877d27df6e8b072d663c839c0b8/lib/lib.es5.d.ts#L1556-L1558):

```typescript
type Required<Object> = {
  [Property in keyof Object]-?: Object[Property];
};
```

For example, it can be used to create a variant of another type where all properties must be specified:

```typescript
interface Options {
  optionA?: boolean;
  optionB?: boolean;
}

const userOptions: Options = { optionA: true };

// After applying defaults, every option should have a value
const options: Required<Options> = {
  optionA: true,
  optionB: false,
  ...userOptions,
};
```

- [TypeScript documentation on `Required`](https://www.typescriptlang.org/docs/handbook/utility-types.html#requiredtype)
- [Try out these examples in TypeScript Playground](https://www.typescriptlang.org/play?#code/IYZwngdgxgBAZgV2gFwJYHsIwLbFRACgEoYBvAWACgYZ9kBTAJzmCnpgHkAHNTEMqjRroeGCAEEA-AC4YAI3ToANvWAQA3IKEjeEAEIz5ilWs3UYAXypaofZDAQgm3XSFkux-ALwDzw0ZjissiMCPQANFoWZloA9LEw4nAMjDDAXFxKYPgA5jAAJvQsCErIIOEw9ABuTGAwOmIwIAAW6CX5MM3ANWkwVcBKYTZ29QEQbjAASvQAjgiojPT5ADwefAB8MD4UfqO6QTAhYZG7DZh6sixKTidCMAB0j47OY+VRZlaU1pS4+MRUQA)

### `Readonly<Type>`

The `Readonly` utility type accepts an object type and marks all of its properties as `readonly`, so they cannot be changed. The `Readonly` utility type is [defined as](https://github.com/microsoft/TypeScript/blob/12d7e4bdbf98a877d27df6e8b072d663c839c0b8/lib/lib.es5.d.ts#L1563-L1565):

```typescript
type Readonly<Object> = {
  readonly [Property in keyof Object]: Object[Property];
};
```

For example, you can use this to create a parameter type for a function so that the function may not change any properties in the object:

```typescript
interface Options {
  optionA?: boolean;
  optionB?: boolean;
}

const userOptions: Options = {
  optionA: true,
};

function runApp(options: Readonly<Options>) {
  // Try to change options after starting to run the app
  options.optionA = false;
  //      ~~~~~~~ Error: Cannot assign to 'optionA' because it is a read-only property.
}
```

In addition to objects, the `Readonly` type also has [special handling in the TypeScript compiler](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-4.html#improvements-for-readonlyarray-and-readonly-tuples) to work with arrays and makes them a `ReadonlyArray` type instead. This ensures that elements in the array cannot be added, removed, or updated by removing associated methods like `push`, `pop`, `shift`, `sort`, and so on:

```typescript
// Readonly<Array<T>> === readonly T[]
function processEntries(entries: Readonly<Array<object>>) {
  entries.slice(1); // slicing is ok, produces a new array
  entries.push({ id: 1 }); // cannot push, will mutate the array
}
```

- [TypeScript documentation on `Readonly`](https://www.typescriptlang.org/docs/handbook/utility-types.html#readonlytype)
- [Try out these examples in TypeScript Playground](https://www.typescriptlang.org/play?#code/IYZwngdgxgBAZgV2gFwJYHsIwLbFRACgEoYBvAWACgYZ9kBTAJzmCnpgHkAHNTEMqjRroeGCAEEA-AC4YAI3ToANvWAQA3IKEjeEAEIz5ilWs3UYAXypaofZDAQgm3XSFkux-ALwDzw0ZjissiMCPQANFoWZlqIKGIwoRJcXAQ6nrIASqoAJphKYAA8HnwAfCQUfjAA9NUwACqMYDDI6DBQABZqAObs6XwwwHAMjDAgyMCMaBDdLW1JLR3swCla-q4AdP0SMD4sSk5mNFaUWrUw2cB5EAWF4oyMwEX1paW7Xj6MufnN9QDaAF1YkgoLoYFxGOg2CAQABRCAhVD0EAEegIxhItwXb43Ir3R5FdByABW9FBrwqaxgaMRyI2ICUqDYBAAjCRzgymfhZqh+OgANbhcGQnIIaGDGAQegAd0GDyeVJpGLpXEcHQIpFoOVkLMs7LqUDUEHQ9lVIA6QulqCUShwCAmDEWy3lYCiVBO1kouHwxCoQA)

### `Record<Keys, Type>`

The `Record` utility type accepts two types, `Keys` and `Type`, and creates an object type where all keys have the type of `Keys` and each value has the type of `Type`. The `Record` utility type is [defined as](https://github.com/microsoft/TypeScript/blob/12d7e4bdbf98a877d27df6e8b072d663c839c0b8/lib/lib.es5.d.ts#L1577-L1579):

```typescript
type Record<Keys extends keyof any, Type> = {
  [Key in Keys]: Type;
};
```

For example, the type `Record<keyof any, unknown>` can represent a generic object where the keys are some type that can used as a key, and the values are unknown (could be a string, object, number, or anything else). The type `keyof any` represents any type that can be used as an object key, so in other words it is effectively shorthand for `string | number | symbol`.

```typescript
type GenericObject = Record<keyof any, unknown>;

const a: GenericObject = {
  test: "something",
  123: "another value",
};
```

More commonly, you would use `Record` to create an object type where the keys are known, and the values are all the same type:

```typescript
type Options = Record<string, boolean>;
const options: Options = {
  optionA: true,
  optionB: false,
};
```

```typescript
type User = {
  id: number;
  name: string;
  email: string;
};

type UsersById = Record<User["id"], User>;
const users: UsersById = {
  1: {
    id: 1,
    name: "test user",
    email: "user@example.com",
  },
};
```

It is also useful for using with [union types](./typescript-union-type) to create an object type where every type in the union must have an associated value:

```typescript
type HttpStatusCode = 200 | 404 | 500;
const httpStatusCodes: Record<HttpStatusCode, string> = {
  200: "OK",
  404: "Not Found",
  500: "Internal Server Error",
};
```

If a new entry is ever added to the union, it _must_ be added to the object, or else an error will occur:

```typescript
type HttpStatusCode = 200 | 201;
const httpStatusCodes: Record<H> = {
  //  ~~~~~~~~~~~~~~~ ERROR: Property '201' is missing
  //  in type '{ 200: string; }' but required in
  //  type 'Record<HttpStatusCode, string>'.(2741)
  200: "OK",
};
```

- [TypeScript documentation on `Record`](https://www.typescriptlang.org/docs/handbook/utility-types.html#recordkeys-type)
- [Try out these examples in TypeScript Playground](https://www.typescriptlang.org/play?#code/IYZwngdgxgBAZgV2gFwJYHsIwLbFRACgEoYBvAWACgYZkwAHAUxgHFGJGAnVKAeQCMAVoyjIYAXhgAlEek4ATADwBrRmHRwYwCGAA0MJMojoA7hAB8AbipUaUTCDHAAXK3ZceA4aIllbNWkZHVwByEHRsRmQAC3wAcxDdfxoARgAmAGZQ7XQYrhgAN2AAGwRGRP8AXxtqWgZmAFUQfMkKWppUeVcIBGx+Lmt2mAhgSNdHbgg4wYCYRlxUYvHkSemqmbqmGCauEAAhMABJeV8ZewVFHc4AbQAiTtuAXX0rq397CEcDZs4QVyv9kcTq1kjAUq42rMOl0wUkhjQRmMYCFkEExAgfhV4XMFktkRiuAABRgAD1G9GKjAAdPZsCFQdVaoy7A50T8AIK+Am-a4pR41Gh0La8ehoBynWQXCbxfT8dDoSnaczvVkwdCijCfVwisWfXyQgLq3Xs1wrMpw2ZGzV7VxwErNC0wRn+IXMAASyGQ9AAyshgMgMQBhdDyZiSNIABgjMAAPjBIykNh8vtFPT6-QGQMHQ39pJKlB6vb7-UGQ4x9NKpuZ9aDIxHXLdeABpW6OyqDZ2UKgLQhEKhAA)

### `Pick<Type, Keys>`

The `Pick` utility type creates a subset of an object by _including_ specific properties. It accepts an object type and a union of keys, and returns a new object type with only the keys specified from the object type. `Pick` is the opoosite of the [`Omit`](#omittype-keys) utility type. The `Pick` utility type is [defined as](https://github.com/microsoft/TypeScript/blob/12d7e4bdbf98a877d27df6e8b072d663c839c0b8/lib/lib.es5.d.ts#LL1571C2-L1572C3):

```typescript
type Pick<Type, Keys extends keyof Type> = {
  [Key in Keys]: Type[Key];
};
```

It can be thought of as repeated application of the [indexing operator](https://www.typescriptlang.org/docs/handbook/2/indexed-access-types.html) to the object type:

```typescript
type User = {
  id: number;
  name: string;
  email: string;
  password: string;
  rating: number;
  reviews: string[];
};
type WithoutPersonalInfo = Pick<User, "id" | "rating" | "reviews">;
// equivalent to:
type WithoutPersonalInfo2 = {
  id: User["id"];
  rating: User["rating"];
  reviewers: User["reviews"];
};
```

```typescript
// Minimum data needed to represent a project
type MinimalProject = Pick<Project, "id" | "name">;
const fullProject: Project = {
  id: 123,
  name: "Test Project",
  description: "This is a test project",
  dateCreated: new Date("2022-01-01"),
  dateUpdated: new Date("2022-01-06"),
  hasIssues: true,
  hasWiki: false,
  users: [],
};
// Any type created via Pick will be satisfiable by the source type
const fullProject2: MinimalProject = fullProject; // ok
const minimalProject = {
  id: 321,
  name: "Project lite",
};
```

- [TypeScript documentation on `Pick`](https://www.typescriptlang.org/docs/handbook/utility-types.html#picktype-keys)
- [Try out these examples in TypeScript Playground](https://www.typescriptlang.org/play?#code/IYZwngdgxgBAZgV2gFwJYHsIwLbFRACgEoYBvAWACgYZkwAHAUxgFURGAnGAXjKppqoAJgC4YEBNgBGnANz8BEYNkZiQyDvgDm86gMa5UAGzUbtugTHqgQAd3QdRMdZog6FNDsDRuxE6XIeMByMAG6ojLYgpq5aANoAuhYwAL7JdEwwAOqoyAAW6AjIAAqcIJjARgCSEHDoPDDFqFAA1gA8bJwANDAARMK9MAA+fV4+WoMjvSHhkSC9AHzJAPTLMIwAjgiooZWMEMi06CIKGcw5+YUlZRXVtegATA2kMMJinRxx-UK9CT1j2ne7E+0282l+-zCEVsZSBnC+M2h8wSqV0pwYzGKHHQACtGFBDrwKHpBE5-DIOMkaEoVDFzEEhIwQFBNPQ0Jg6W4qTAhN5GABhEJ8pwAET53N5yEYLHoksYovFQTyoCqIBACCZYik6HQRkYwAg3OVIByLVQWp1eoN3IQwOirGBiWSKQUqxgAFl8KhsJIed5gOJGPL5Udgox6CF2AcYAGI7j8ch0ZlPRBvZUsfGCQ0mq02hm8QSet9Jn0aYxFskoJh1PAEEYjPmE2JG1miUE3jAAIwPADMXSCZbEvQAKkzDi3kL1+ySeUyWag2RgIEPh3lUCBXhuA1Ka3GC5Pp5Y5YL9VKyZEYGKpQReg8AAwPB4AWjvnZfnd6REPAjlMrl59sS8+Rve9H3fF8ADZP2-GhjVVdVNVoDgNRgmBjVNc14EqdhUNtWEYESb80ldNYAEEIDAWgMRgFlTxDcIAxzFoYFsYwjBgGRnDBEA4FQYApD1DjKPyZhygQDgoGYM4FCrCAa0QesJweMQUzTBtsX3BoFPUzNkFkGA3XQFoZOrQ5sC9XAdM0tsZw7HsHk7VDBz6CcYCMXJyyI3QXUoKgqEMQgiCoIA)

### `Omit<Type, Keys>`

The `Omit` utility type creates a subset of an object by _excluding_ specific properties. It accepts an object type and a union of keys, and returns a new object type with all the properties of the original object, except the keys specified. `Omit` is the opposite of the [`Pick`](#picktype-keys) utility type. The `Omit` utility type is [defined as](https://github.com/microsoft/TypeScript/blob/12d7e4bdbf98a877d27df6e8b072d663c839c0b8/lib/lib.es5.d.ts#L1594):

```typescript
type Omit<Type, Keys extends keyof any> = Pick<Type, Exclude<keyof Type, Keys>>;
```

Note that this definition utilizes [`Exclude`](#excludeuniontype-excludedmembers) and [`Pick`](#picktype-keys) to essentially perform an inverse selection of properties, where we pick all properties, but exclude the ones that are part of the passed in `Keys` union.

`Omit` is helpful when you want to create a new type from an existing one, and keep most of the properties the same except for a few. For example, if you have a `User` type that contains a `password` property, you may want to create a `UserWithoutPassword` type that is the same as `User`, but with the password omitted.

```typescript
type User = {
  id: number;
  name: string;
  email: string;
  password: string;
};
type UserWithoutPassword = Omit<User, "password">;
const user: UserWithoutPassword = {
  id: 123,
  name: "Test User",
  email: "user@example.com",
};
```

Or, it could be used to remove props from a React component that are handled automatically by a component:

```tsx
type ButtonAttributes = {
  onClick: () => void;
  type: "button" | "submit" | "reset";
  children: React.ReactNode;
  disabled?: boolean;
  className?: string;
};
function Button(props: Omit<ButtonAttributes, "type">) {
  // The `type` attribute is preconfigured, so we omit it from the
  // accepted props and hardcode it to "button" in the component
  return <button {...props} type="button" />;
}
```

- [TypeScript documentation on `Omit`](https://www.typescriptlang.org/docs/handbook/utility-types.html#omittype-keys)
- [Try out these examples in TypeScript Playground](https://www.typescriptlang.org/play?target=9&pretty=false#code/JYWwDg9gTgLgBAJQKYEMDG8BmUIjgcilQ3wFgAoClAZwE8A7NOTAV0ZmAnrhBWHoAUASjgBvCnDgxaYJHACq1JFDgBeMRMlxgAEwBcceixAAjZQG5Nk+ihBID1GFH4BzS+S1wkvYABsHTq7unmA01ADu0Ppwjs70bpoAvsFSMnKKygDqwDAAFhAsMAAKYZFQOmpwAPIgOQA8GVAANHAARKHUEVGtAHwpaFyOcCxKUAaN2XkFxaVRleIeWroGAIwATADMTVaGtvZtACpIQ42t24uS3nz+bSPKAAJIAB62YL5IAHQDIGdJ7pqaaSyOAAIUKMC4AEEYIETIVjvMdlwAMK+YBoADWBmEah6cAAbhBdClJED9q04TCuK04AAfNrUFgmWowGn01pEJSsklwHTAagoEzvHQAfgMJggEHeKHoPLQvjCADk9mKYoF4ilkppWOxONwwVTBGAcGBqAYavUDRD6NDYfDqC1WmTeiIFp4APTuuAHXJyAAGZL9cBQMOclLk-LgxqQA3omGALhYRB0LWoEDg4TkuBy2iwODweSQO09wbQaCQYBgSAqxogpuD9AquRQ5QGOgj8AhbUp1pp-Ckvrg30g9CQ9BgOyIMCT3DqPa4Yg+S9rpsSqVkqgp4OpcHdfSSFESFGP5B8giEFCAA)

## Union manipulation types

### `Exclude<UnionType, ExcludedMembers>`

The `Exclude` utility type accepts a union type and a union of types to remove from the passed in union type. The returned type is the union type without the specified types. `Exclude` is sort of like [`Array.filter`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter) or [`Omit`](#omittype-keys), but for union types. `Exclude` is the opposite of the [`Extract`](#extracttype-union) utility type. The `Exclude` utility type is [defined as](https://github.com/microsoft/TypeScript/blob/12d7e4bdbf98a877d27df6e8b072d663c839c0b8/lib/lib.es5.d.ts#L1584):

```typescript
type Exclude<Type, ExcludedUnion> = Type extends ExcludedUnion ? never : Type;
```

`Exclude` can be used to a few types from a union type:

```typescript
type Numbers = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
type EvenNumbers = Exclude<Numbers, 1 | 3 | 5 | 7 | 9>; // => 2 | 4 | 6 | 8 | 10
type OddNumbers = Exclude<Numbers, EvenNumbers>; // => 1 | 3 | 5 | 7 | 9
```

Importantly, `Exclude` removes any types from the union which are _assignable_ to the union of excluded types, so it can be used to filter categories of types:

```typescript
type X = string | null | undefined;
type Defined<Value> = Exclude<Value, null | undefined>;
type DefinedX = Defined<X>; // => string
```

```typescript
type Values = Exclude<
  string | number | (() => void) | ((...args: unknown[]) => boolean),
  Function
>;
// => string | number
```

For more examples, check out my [blog post on union types](./typescript-union-type#how-to-get-a-subset-of-a-union-type).

- [TypeScript documentation on `Exclude`](https://www.typescriptlang.org/docs/handbook/utility-types.html#excludeuniontype-excludedmembers)
- [Try out these examples in TypeScript Playground](https://www.typescriptlang.org/play?target=9&pretty=false#code/IYZwngdgxgBAZgV2gFwJYHsIwLbFRACgEoYBvAWACgYZkwAHAUxgDkFsAjRgJxBgF4YARhgAfGACYxMAMzSALNICs0gGzSA7NIAc0gJzShABgDcVGnSYwAogDdGENpx59B1gB5QANggAmjAB4nLl4AGmFpOXEVcS1xPQA+M2paBmYAeV9fYJcBG08ffyD2EJBwuwcc3iSqc1SrAA08kGRufABzaQgELy9pJH84fEZfOstmABFGIYgRgIA1YB9GBLyPbz9AxeXw7t7+iEHh3wSxtJgpmZGmwUvjgIbVgHongVWWtoh22pTxmG2EIxXPkNkUPh0uiUeNICMQ3jBbOhUL4SOJYQA6THAbjtEAALhgSAA1hB0AB3CAAbQAuiR+KsOOh0F5GMAIERwgAxJBQNCYU6UAC+PyouHwxCoQA)

### `Extract<Type, Union>`

The `Extract` utility type accepts a union type and a union of types to extract from the passed in union type. The returned type is the union of types which are assignable to the union of types passed in. `Extract` is sort of like [`Pick`](#picktype-keys) but for union types instead of object types. `Extract` is the opposite of the [`Exclude`](#excludeuniontype-excludedmembers) utility type. The `Extract` utility type is [defined as](https://github.com/microsoft/TypeScript/blob/12d7e4bdbf98a877d27df6e8b072d663c839c0b8/lib/lib.es5.d.ts#L1589):

```typescript
type Extract<Type, Union> = Type extends Union ? Type : never;
```

`Extract` can be used to remove all but a few types from a union type:

```typescript
type Days =
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday"
  | "Sunday";
type Weekend = Extract<Days, "Saturday" | "Sunday">; // => 'Saturday' | 'Sunday'
```

Like `Exclude`, `Extract` can be used to filter entire categories of types, since it removes any types from the union which are _assignable_ to the union of types to extract:

```typescript
type Types =
  | string
  | number
  | boolean
  | (() => void)
  | ((...args: unknown[]) => boolean)
  | Map<unknown, unknown>
  | Set<unknown>;
type Objects = Extract<Types, object>;
// => Map<unknown, unknown> | Set<unknown> | (() => void) | ((...args: unknown[]) => boolean)
type Functions = Extract<Types, Function>;
// => () => void | ((...args: unknown[]) => boolean)
type Values = Extract<Types, string | number | boolean>;
// => string | number | boolean
```

```typescript
type NumberValue = Extract<
  string | number | Date | Array<number>,
  { valueOf: () => number }
>;
```

For more examples, check out my [blog post on union types](./typescript-union-type#how-to-get-a-single-type-from-a-union-type).

- [TypeScript documentation on `Extract`](https://www.typescriptlang.org/docs/handbook/utility-types.html#extractuniontype-extractedunion)
- [Try out these examples in TypeScript Playground](https://www.typescriptlang.org/play?target=9&pretty=false#code/IYZwngdgxgBAZgV2gFwJYHsIwLbFRACgEoYBvAWACgYZkwAHAUxgBFgwQYBeKmmgHxgAiALKYAJuyG8+goQBUEjEJLDTqs4QHVG4iMtXq+MOfIAWCAE4qpMgcIBil1IbsnhAZWDIrrjfaEPJEMAbhk6JhgdRgBrRghxbhgAUQAPZEtgKGQAHjYOABpPb18pd0DgqQA+EJgAejruKpgAci8fS1UW9zbKsBaqcIZmeWHOLhgQDPwAc3cIBGwAI0ZLdyX0dAAbRmAsQQJiJpgAN3QXEgOCADpb4EsZkAAuGCQYiHQAdwgAbQBdEhcZobba7CCXGAiYD0HJvD7fIpwr4QZqCDyMXJI741IaRADySwAVoxsuMUulMtkcqMmCAiugiSTkDV6o0gZDobCIO9kYjufCUe50Zj+cjUTBDoDmmcLu5DrdrvdHi8sb8AccQTs9kRccwHEhshgIGS0hksrkacoivqUEaWQ1jkd2TLElcFUrnq9Rd9-lKYJqwTqNBFmAA1YBbJQminm6ljIpTZwQOaCBbLVbrTZalG1B3sxOzeaLFZrQQBvaDYPDGAAOWLq3DkeYE1NlNyBeTRfTpdY3mYggAgpZMmAcmmS1UiqRThGlHi4C8nc1xxmAL5VKirytUXD4YhUIA)

### `NonNullable<Type>`

The `NonNullable` utility type accepts a union type and returns a new type that is guaranteed not to contain `null` or `undefined`. The `NonNullable` utility type is [defined as](https://github.com/microsoft/TypeScript/blob/12d7e4bdbf98a877d27df6e8b072d663c839c0b8/lib/lib.es5.d.ts#L1599):

```typescript
type NonNullable<Type> = Type & {};
```

This is a shorthand definition that utilizes how the empty object type and intersection operator interact with each other. A more intuitive definition using [`Exclude`](#excludeuniontype-excludedmembers) would be:

```typescript
type NonNullable<Type> = Exclude<Type, null | undefined>;
```

It can be used to ensure that a type is definitely defined:

```typescript
type Value = NonNullable<string | number | undefined | null>; // => string | number
```

```typescript
type User = {
  id: number;
  name: string;
  phone?: string;
};
type PhoneNumber = NonNullable<User["phone"]>; // => string
```

- [TypeScript documentation on `NonNullable`](https://www.typescriptlang.org/docs/handbook/utility-types.html#nonnullabletype)
- [Try out these examples in TypeScript Playground](https://www.typescriptlang.org/play?#code/IYZwngdgxgBAZgV2gFwJYHsIwLbFRACgEoYBvAWACgYZkwAHAUxgDVgAbBZgXhgDlMfBO3bAARu0YAeEMgBO+AOYwAPjAgJsYxnNUwkAE0Zx8jA3o0iAfAG4YAensxuVmLIURlajVp1UqNHRMMACqIDrOZAE0MKgGAFzqmtpyNtE0EMDYjInuSmnUMfQAFpiMAPy58vnRAL4FgQzMAAqlEIxCvrq8AhBCIuKSUmE6ANoARCVl4wC6tg5OLm7VnlS1-pRUuPjEVEA)

## Function types

### `Parameters<Type>`

The `Parameters` utility type accepts a function and returns the parameter types of that function as an array (tuple). The `Parameters` utility type is [defined as](https://github.com/microsoft/TypeScript/blob/12d7e4bdbf98a877d27df6e8b072d663c839c0b8/lib/lib.es5.d.ts#L1604)

```typescript
type Parameters<Type extends (...args: any) => any> = Type extends (
  ...args: infer Args
) => any
  ? Args
  : never;
```

The `Parameters` allows us to extract the parameter types out of a function and use it like any other type.

```typescript
function add(a: number, b: number) {
  return a + b;
}

type AddParameters = Parameters<typeof add>; // => [a: number, b: number]
```

Note that we need to use `typeof add` here to refer to the `add` function **type**, rather than the `add` function itself.

This is type is especially useful for creating functions that utilize standard library functions, because we can avoid the need to rewrite the type:

```typescript
function getUtcDate(...args: Parameters<typeof Date["UTC"]>) {
  // args has the following type:
  // => [year: number,
  //     monthIndex: number,
  //     date?: number | undefined,
  //     hours?: number | undefined,
  //     minutes?: number | undefined,
  //     seconds?: number | undefined,
  //     ms?: number | undefined]
  return Date.UTC(...args);
}
```

```typescript
// These filters are guararanteed to work with `Array.filter` since
// we use its callback type explicitly
type FilterFunction = Parameters<typeof Array["prototype"]["filter"]>[0];
const booleanFilter: FilterFunction = (value) => !!value;
const positiveFilter: FilterFunction = (value) =>
  typeof value === "number" && value > 0;
const array = [0, 1, null, 3, false, -1, ""]
  .filter(booleanFilter)
  .filter(positiveFilter);
```

- [TypeScript documentation on `Parameters`](https://www.typescriptlang.org/docs/handbook/utility-types.html#parameterstype)
- [Try out these examples in TypeScript Playground](https://www.typescriptlang.org/play?#code/IYZwngdgxgBAZgV2gFwJYHsIwLbFRACgEoYBvAWACgZ4ko1MZgATZg4ALhggWwCMApgCcANDD5ce-YSQrUaMIQOQIhWYDADU4qjQC+VXTGRgADgJgBBVgAVgQ4NmXCQMALww7Dp8hcAeE3N0OCZWAD4YAHpI9wiAbU5uXkFRcUlk4QBdQ3lEFAwsAHNlAFVkKAARYF8CADp6+0KQLi9HZyEQALMBYJgq3ziAchKAFQBhQcyw2SMaaKYhJpgAC1BjZYs4dAAbbfQAd3xC426OWaiYt3iwAXt06VFz+YUcTGRlgEkIZgEAD3uUiInjEXsxqgIAPwA4QwAA+MCQPzg+AEzCB8jmIIUy3QqhAUKSDzhCO+AmREFR6JezwU2HwCF8+OhQmJiLJKLRwJeMBAAigmGYTMJKVZpPJlK5L2wQqkIvhbPFzGyGMUylUWH6AlqozGdQaixARCMBkoRnmIw2vPgqG2vg6CwshQQ9hdEF8qOM6Bg+3QQgA1t7UO8YAADSxCBxgWrI23CEM8-BQARmmL7CwIK1B1xQYC7PjAKABwIWP6mbaoKBB7ZgIzFmAAMRtdvrdAYWA8rR8-mLvXDkbiACJTEJ0MhR90B5lBzG7ZOwnEAAyZADcRn5EBAyHE6B2twgjdjQi4B+brYK7hgBAAbrmEAISFcYABCJ837Z31fydebmCmdAgINUCvAQT2EY8m2EFt8kYDxr1ve9YhOIIQjfO93DcDxBllYRBhgAAyPCYFQiwIgXNdMB-exIwvRcxAARjEHhdjEABmMQ4FzXkxAAWgYmAB0naMIKEAg+B3bY91AoQiCEw8CD-AC0GAqSiE-E0clwfBiCoIA)

### `ReturnType<Type>`

The `ReturnType` utility type takes a function type and takes on the type of whatever that function returns. The [definition of `ReturnType`](https://github.com/microsoft/TypeScript/blob/12d7e4bdbf98a877d27df6e8b072d663c839c0b8/lib/lib.es5.d.ts#L1614) is almost exactly the same as [`Parameters`](#parameterstype), but it infers the return type instead of the parameter types:

```typescript
type ReturnType<Type extends (...args: any) => any> = Type extends (
  ...args: any
) => infer Return
  ? Return
  : any;
```

It allows us to get the return type of any function we pass in:

```typescript
function sayHello(name: string) {
  return `Hello ${name}!`;
}
type Greeting = ReturnType<typeof sayHello>; // => string
```

```typescript
function add(a: number, b: number) {
  return a + b;
}
type Sum = ReturnType<typeof add>; // => number
```

One of the most useful aspects is that we can re-use the return types of built-in functions:

```typescript
type Value = string | number
type Entries = ReturnType<typeof Object.entries<Value>>
// => [string, Value][]
const entries: Entries = [
  ['key', 'value'],
  ['key2', 123]
]
```

- [TypeScript documentation on `ReturnType`](https://www.typescriptlang.org/docs/handbook/utility-types.html#returntypetype)
- [Try out these examples in TypeScript Playground](https://www.typescriptlang.org/play?#code/IYZwngdgxgBAZgV2gFwJYHsIwLbFRACgEoYBvAWACgZ4ko1MYRgwAJAUwBtP0CJhs7AFxNkAJ3wBzEhWo0YY9sgRisAAw7d0MACSl+ggL4BCNVRqHzMZGAAO7GAHFFSqTAC8MAEpKVEACp27AA8NvbocEwsmjwAfDAA9Ake8SDiUlRWiCgYWMAAJvkEwCIQCNgARuxiADQwFaXlVWIyVjSKyqowwDAA1PUA3FaWcmEOAMrlHt6+qoH2oUER3YWxA4nJ7vFlldWZo0EwAGrAnAgOnmkSEJIwAD4wO81WYzAAohDp7CDTPp0BQUW4UiAHkKgArdj0AB07E+Em+wROZ3YsXiSRSMAA2lcpHVkecALpYwlWKCYNIwOFfEAiD406ZYtrYgDkAGt2GAWXUWQA3U7nFmEmrMrHszkAJm5MAAjBKAMykuRKkb7XD4YhUIA)

## Class / object-oriented types

### `ConstructorParameters<Type>`

The `ConstructorParameters` utility type takes a class type and returns an array of the types of the constructor's parameters. The [definition of `ConstructorParameters`](https://github.com/microsoft/TypeScript/blob/12d7e4bdbf98a877d27df6e8b072d663c839c0b8/lib/lib.es5.d.ts#LL1609C22-L1609C22) is almost exactly the same as [`Parameters`](#parameterstype), but it constrains the accepted types to be a constructable/instantiable type:

```typescript
type ConstructorParameters<Type extends abstract new (...args: any) => any> =
  Type extends abstract new (...args: infer Params) => any ? Params : never;
```

It allows us to get the parameter types of any class we pass in:

```typescript
type DateParameters = ConstructorParameters<typeof Date>;
// => [value: string | number | Date]
type SetParameters = ConstructorParameters<typeof Set>;
// => [iterable?: Iterable<unknown> | null | undefined]
type RegexParameters = ConstructorParameters<typeof RegExp>;
// => [pattern: string | RegExp, flags?: string | undefined]
type FormatParameters = ConstructorParameters<typeof Intl.DateTimeFormat>;
// => [locales?: string | string[] | undefined,
//     options?: Intl.DateTimeFormatOptions | undefined]
```

It also works with any type that has a `new` constructor:

```typescript
type Vector = { new (x: number, y: number): { x: number; y: number } };
type VectorParameters = ConstructorParameters<Vector>;
// => [x: number, y: number]
```

- [TypeScript documentation on `ConstructorParameters`](https://www.typescriptlang.org/docs/handbook/utility-types.html#constructorparameterstype)
- [Try out these examples in TypeScript Playground](https://www.typescriptlang.org/play?ssl=14&ssc=31&pln=12&pc=3#code/IYZwngdgxgBAZgV2gFwJYHsIwLbFRACgEoYBvAWACgYZkwAHAUxgBFhlGAFYAJ2G0YceIGAF4YAYUwhkPBFGToe3PgKEgAPHSbo4rdowB8VGgHpTYwzADaAN2AAbBIwBcMGT3wBzGAB8YEAjYAEaMPH76HAC6JrQMzADKgir8gmEi4lIQHvKKyryp6lrxujBJyMbUMOaWNqhCwMEOjAD8bgCSDU2MGkgA1hDoAO4QVv6BDg4RSAAmjHD4jDMxVdrMAEqMXowAHilq6WKS0rK5SvtpwsU6epteAKI79JVmFqJW1vTsQhBuHt4RO6PegAGngDmAXhAbXcsgB-lm80Wy1iaxgADElLhkBd1EcsjkFOcCgcrmtSu0IMgHAA6NgcAAqqAEmJ42Je1TeHwc6CgjkY0L+cIgPn8-xF1ii0wgcwWECWINiNRoNHQ9DQ0hhlOpdIMTJZWPYAHl1RhstLZciVqj4jAAGqMInhcSkAKMIYwAg7NyBEJhMFgH1BUI8IhuV3egLBsIAbhggajfvCAF8YMmYzamPbHXlcYdMic5E681cHU7DBmqjV3jZI76QwGg0mVsmqG3KLh8MQqEA)

### `InstanceType<Type>`

The `InstanceType` utility type takes a class type and returns the type that will be instantiated by the constructor. This is similar to the `ReturnType` utility type, but only returning the type of the constructor function. In essence, it strips away `typeof` in an expression like `typeof Instance` and simply returns `Instance`. For example:

```typescript
type DateType = InstanceType<typeof Date>;
// => Date
type SetType = InstanceType<typeof Set>;
// => Set
type ArrayType = InstanceType<typeof Array>;
// => unknown[]
```

This also works for any type that has a `new` constructor:

```typescript
type Vector = { new (x: number, y: number): { x: number; y: number } };
type VectorType = InstanceType<Vector>;
// => { x: number; y: number }
```

- [TypeScript documentation on `InstanceType`](https://www.typescriptlang.org/docs/handbook/utility-types.html#instancetypetype)
- [Try out these examples in TypeScript Playground](https://www.typescriptlang.org/play?#code/IYZwngdgxgBAZgV2gFwJYHsIwLbFRACgEoYBvAWACgYZkwAHAUxgBFhlGAVB5gXhgCSEEMmDQuPADx0m6OK3aMAfFRoB6NTF5KFHVbR4wAyo2TcmWwcNHjzjaTznHTK6jA1adJ5PpnMAggBOgcBgdpZCImJQEkwOsvJBIWCu6praMEgA1hDoAO4QANoAulS+hgBqjFDI6IGWpDAQjHkwBAAeAFxNCNgARoyBADQwYN0QvQOBRN2NXT39gwDco+OTgzAAvltL5RZVNXXh-JE2MXaSB7WBSrtuHhlza4uBK2MLU1tUm2WUVLj4YhUIA)

### `ThisParameterType<Type>`

The `ThisParameterType` utility type takes a function type and returns the type of the `this` parameter, if there is one. Otherwise, it returns `unknown`. It is [defined as](https://github.com/microsoft/TypeScript/blob/12d7e4bdbf98a877d27df6e8b072d663c839c0b8/lib/lib.es5.d.ts#L329):

```typescript
type ThisParameterType<Type> = Type extends (
  this: infer This,
  ...args: never
) => any
  ? This
  : unknown;
```

It allows you to extract the type of object that a function expects to be bound to. For example:

```typescript
// Function that acts as if it were a class method
function vectorLength(this: { x: number; y: number }) {
  return Math.sqrt(this.x ** 2 + this.y ** 2);
}
type Vector = ThisParameterType<typeof vectorLength>;
// => { x: number; y: number; }
const vector: Vector = { x: 3, y: 4 };
// Bind an object to the function so that it can be called like a method
const length = vectorLength.bind(vector);
console.log(length()); // => 5
```

And for most functions that do not have a `this` parameter, it returns `unknown`:

```typescript
type NoThis = ThisParameterType<(x: number) => number>;
// => unknown
```

- [TypeScript documentation on `ThisParameterType`](https://www.typescriptlang.org/docs/handbook/utility-types.html#thisparametertypetype)
- [Try out these examples in TypeScript Playground](https://www.typescriptlang.org/play?#code/IYZwngdgxgBAZgV2gFwJYHsIwLbFRACgEoYBvAWACgYYB6WmAMSSjUxmQAthkZhWQfQajgxUvAO4BTAE5S+MKABtQg7FK7oAJlRqIUGLADcprdDIAyUiAHMuBLqhAAuMgA9XEBNgBGsgDQwYJ7efjIAviQU1DQwcsgIMlgAsjycAHQgAI4yyA6cTuluAFTFAEwwANQcBSDpYKVlRLow4S3IYAAO8gBqpsjmMAC8MAAqtQAKwDLA6siyo11SADwd3eiiJmaW1nacAHwt9MP7ZDAeMF6+sgDcQSHXMndtMVCYILxbAzKufdvDZwuAGZAsEYAAWVpHBgAIXwWj4WHQPgAVv0OOgavJ9KxDDAQJiuDwxLwoMAsH5FMAlEopAilKgANbyYA4DScbQtN4QD4wWm2LgAr7mKwCjI+eEEYUyZqvd7oWnpJToGwEfl7YgkY5DU4AVio7SWMAAcuhxk4AeaQFMZnMFktlgQLlcwiQdZdQrJ9jdoScYEhGRB0BIIFQXgbKLh8MQqEA)

### `OmitThisParameter<Type>`

The `OmitThisParameter` utility type takes a function type and returns a new function type with the `this` parameter removed. If the passed in function does not have a `this` parameter, it is returned unchanged. It is [defined as](https://github.com/microsoft/TypeScript/blob/12d7e4bdbf98a877d27df6e8b072d663c839c0b8/lib/lib.es5.d.ts#L334):

```typescript
type OmitThisParameter<Type> = unknown extends ThisParameterType<Type>
  ? Type
  : Type extends (...args: infer Arguments) => infer ReturnType
  ? (...args: Arguments) => ReturnType
  : Type;
```

It allows you to remove the `this` parameter from a function type, so that it can be used like a callback or an already bound function:

```typescript
// Function that acts as if it were a class method
function vectorLength(this: { x: number; y: number }) {
  return Math.sqrt(this.x ** 2 + this.y ** 2);
}

type BoundLength = OmitThisParameter<typeof vectorLength>;
// => () => number
const length: BoundLength = vectorLength.bind({ x: 3, y: 4 });
console.log(length()); // => 5
```

And for most functions that do not have a `this` parameter, it returns the same type:

```typescript
type NoThis = OmitThisParameter<(x: number) => number>;
// => (x: number) => number
```

- [TypeScript documentation on `OmitThisParameter`](https://www.typescriptlang.org/docs/handbook/utility-types.html#omitthisparametertype)
- [Try out these examples in TypeScript Playground](https://www.typescriptlang.org/play?#code/IYZwngdgxgBAZgV2gFwJYHsIwLbFRACgEoYBvAWACgYYB6WmAMSSjUxmQAthkZhWQfQajgxUvAO4BTAE5S+MKABtQg7FK7oAJlRqIUGLADcprdDIAyUiAHMuBLqhAAuMgA9XEBNgBGsgDQwYJ7efjIAviQU1DQwcsgIMlgAsjycAHQgAI4yyA6cTuluAFTFAEwwANQcBSDpYKVlRLow4VQtyGAADvIAQuhIWla2XDAAvDAA8tjiACq1AArAMsDqyLIAPJ096KImZpbWdpwAfC304ycwxJcwXr6yLVCYILxKR1yu-YPDx+Mw+2Q5l+XHSPnwWgIpBgHhgAGZAsEYAAWVrNGLPCAgdDvdJKdA2AjvEacYgkC5jK4AVnaMW28gAcuh5k5-tM5otlqsNJsCLD7mESJS7qFZCcANznBjCvkhB4yIVXAWPShtSi03D4YhUIA)

### `ThisType<Type>`

The `ThisType` utility type is a special type that hints what the type of `this` in a function type should be. Its definition is empty, because it is treated as a special type by the TypeScript compiler. When the compiler sees this type, it knows to treat `this` as whatever the passed in `Type` is.

For example, suppose that we have a user type:

```typescript
type User = {
  id: number;
  firstName: string;
  lastName: string;
};

const user: User = {
  id: 123,
  firstName: "Test",
  lastName: "User",
};
```

We can create a function that extends this object with more behaviors:

```typescript
function addUserMethods<Methods extends Record<string, Function>>(
  user: User,
  // Note: ThisType is used to indicate that the methods should type `this`
  // with the type of `User`
  methods: Methods & ThisType<User>
) {
  // Casting is necessary here to get the correct type, since
  // we've arbitrarily modified the object to add more properties
  return { ...user, ...methods } as User & Methods;
}
```

Then, when we go to use this function, we get a much improved developer experience since we do not need to specify any types in our additional methods:

```typescript
const newUser = addUserMethods(user, {
  getFullName() {
    // These properties correctly resolve because `this` is a `User`.
    // This code would fail to compile without the `ThisType<User>`
    return `${this.firstName} ${this.lastName}`;
  },
  generateEmail() {
    return `${this.firstName[0]}${this.lastName}@example.com`;
  },
});

console.log(newUser.getFullName()); // => "Test User"
console.log(newUser.generateEmail()); // => "TUser@example.com"
```

- [TypeScript documentation on `ThisType`](https://www.typescriptlang.org/docs/handbook/utility-types.html#thistypetype)
- [Try out these examples in TypeScript Playground](https://www.typescriptlang.org/play?#code/IYZwngdgxgBAZgV2gFwJYHsIwLbFRACgEoYBvAWACgYZkwAHAUxgFURGAnGAXjKppqoAJgC4YEBNgBGnANz8BcVBxDIAcsGyMxqjvgDm86gIA2odZu0xdBozQC+VBVEyqYCdhzFtOPPscFRGABGACYAZgAaBRolFQstMQByABVGVSTogJgzVQ1EmCSfDkyFR0oFRBQMLGAhIWKAWUZkAAt0IRAAHma2jpAYRgAPZEYITpgAJUYXDiEumwh9SJgAMSQoNEwAPm2CGPdPb08sgRgAenOYNXRRsRTW1BAUhmYnw8YhWnQYfCFUKDAUa0VpAkHMLR9CYgdoIExfOhMGAAAzaT2RB0uMAA7qg2uDaK8YOg4CjihjspD2p0xL1qQMAGQwB5PF5MLrFbYKEgUbJYgDC5gMvwGEBm6RAwA4YBgrU4zGQP30LQJsw4M2QhKYKxA+CgjExV2xjCSADdmFKpHiOFLUCYZdgOqglJ8CegpAArDXfGB1L6O9UwegcdBMDhodIHdXIBAcLCkGAAOmTHk4K2Tiap-Rg9l9A2KMCZdP6dhzTmMLggbjF2ILvD9TRa9IIqY4K15Z2VyHWJhM+UYxH8ZxoWIe6WYwdDnAjAzVGvtMHVIHQJnNMBkgNTKLRIGRstAWuYJLJnj3wAQitwaEBvbAiYOI6uLNnHWY2PQcK+cDwJh9Lmw9B2m+eKwpqbTMMiz5sowHKeNsFLDouLSxlgyIACSkDuiZxHkli5hhWG5AkjD2AhAj2KcAjKmKNqjAAorgdqDh2w7RihKIEY8IDYcouFaAA2gADAAuvYnFPImRH9vYAACwyaPQJiMIm-5kQ4ZREOWNCVsuSmSeg+gEDWxSJl2PZ9pYxAkFi3DbDAABEaRuMU9nOK4K7KSYBlGYwtaeKZYycECjAMT+VkXFctkOSkxRyUMCl6f+rmUOU5aMYQmmUEAA)

## String manipulation types

### `Uppercase<StringType>`

The `Uppercase` utility type accepts a [string literal type](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#literal-types) and returns a new string type where all characters are uppercase. The `Uppercase` utility type is an intrinsic compiler function, so unfortunately its definition is not available.

```typescript
type Upper = Uppercase<"typeScript">; // => "TYPESCRIPT"
```

- [TypeScript documentation on `Uppercase`](https://www.typescriptlang.org/docs/handbook/utility-types.html#uppercasestringtype)
- [Try out these examples in TypeScript Playground](https://www.typescriptlang.org/play?#code/IYZwngdgxgBAZgV2gFwJYHsIwLbFRACgEoYBvAWACgYZkwAHAUxgA0YBeGAcjqYGUoAJ1T1kXKjV7MAqvSaCOMWfKihGAHhYA+CbQbMAMugDujBZyOnBqkBu26pMAMLB6qZMAA2il24+fUAC87HWo9JiVoV3cvRWkovy8gkKoAXyoMylx8YiogA)

### `Lowercase<StringType>`

The `Lowercase` utility type accepts a [string literal type](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#literal-types) and returns a new string type where all characters are lowercase. Unfortunately, the definition of the `Lowercase` utility type is not available to us, as it is an intrinsic compiler function.

```typescript
type Lower = Lowercase<"TypeScript">; // => "typescript"
```

- [TypeScript documentation on `Lowercase`](https://www.typescriptlang.org/docs/handbook/utility-types.html#lowercasestringtype)
- [Try out these examples in TypeScript Playground](https://www.typescriptlang.org/play?#code/IYZwngdgxgBAZgV2gFwJYHsIwLbFRACgEoYBvAWACgYZkwAHAUxgA0YBeGAcjqYGUoAJ1T1kXKjV7MAqvSaCOMWfKihGAHhYA+CbQbMAMugDujBZyOnBqkBu26pMAMLB6qZMAA2il24+fUAC87HWo9JiVoV3cvRWkovy8gkKoAXyoMylx8YiogA)

### `Capitalize<StringType>`

The `Capitalize` utility type accepts a [string literal type](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#literal-types) and returns a new string type where the first character is uppercase and the remaining characters are lowercase. Unfortunately, we cannot easily view the definition of the `Capitalize` utility type, since it is an intrinsic compiler function.

```typescript
type Capitalized = Capitalize<"typeScript">; // => "TypeScript"
```

- [TypeScript documentation on `Capitalize`](https://www.typescriptlang.org/docs/handbook/utility-types.html#capitalizestringtype)
- [Try out these examples in TypeScript Playground](https://www.typescriptlang.org/play?#code/IYZwngdgxgBAZgV2gFwJYHsIwLbFRACgEoYBvAWACgYZkwAHAUxgA0YBeGAcjqYGUoAJ1T1kXKjV7MAqvSaCOMWfKihGAHhYA+CbQbMAMugDujBZyOnBqkBu26pMAMLB6qZMAA2il24+fUAC87HWo9JiVoV3cvRWkovy8gkKoAXyoMylx8YiogA)

### `Uncapitalize<StringType>`

The `Uncapitalize` utility type accepts a [string literal type](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#literal-types) and returns a new string type where the first character is lowercase and the remaining characters are unchanged. It essentially does the opposite of the [`Capitalize`](#capitalizestringtype). `Uncapitalize` is an intrinsic utility type, so unfortunately its definition is not readily available.

```typescript
type Uncapitalized = Uncapitalize<"TypeScript">; // => "typeScript"
```

- [TypeScript documentation on `Uncapitalize`](https://www.typescriptlang.org/docs/handbook/utility-types.html#uncapitalizestringtype)
- [Try out these examples in TypeScript Playground](https://www.typescriptlang.org/play?#code/IYZwngdgxgBAZgV2gFwJYHsIwLbFRACgEoYBvAWACgYZkwAHAUxgA0YBeGAcjqYGUoAJ1T1kXKjV7MAqvSaCOMWfKihGAHhYA+CbQbMAMugDujBZyOnBqkBu26pMAMLB6qZMAA2il24+fUAC87HWo9JiVoV3cvRWkovy8gkKoAXyoMylx8YiogA)
