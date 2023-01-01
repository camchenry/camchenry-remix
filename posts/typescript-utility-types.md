---
title: "A Complete Guide to TypeScript Utility Types"
summary: "TODO: Summary"
publishedAt: "2022-11-21"
tags:
  - typescript
type: guide # 'guide' or 'post' or 'til'
published: false
---

## What are utility types?

Utility types are helpers provided automatically by TypeScript to make common typing tasks easier. Since they are standard across _all_ TypeScript codebases, they are sort of like the "standard library of TypeScript."

TypeScript lets you define [reusable types via the `type` keyword](https://www.typescriptlang.org/docs/handbook/declaration-files/by-example.html#reusable-types-type-aliases). There is nothing special about utility types, all of the types are reusable types that happen to be automatically included with every TypeScript installation. All of the definitions for each utility type are freely available on GitHub.

## Utility Types

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

It is also useful for using with [union types](./typescript-union-type.md) to create an object type where every type in the union must have an associated value:

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

The `Pick` utility type creates a subset of an object by _including_ specific properties. It accepts an object type and a union of keys, and returns a new object type with only the keys specified from the object type. The `Pick` utility type is [defined as](https://github.com/microsoft/TypeScript/blob/12d7e4bdbf98a877d27df6e8b072d663c839c0b8/lib/lib.es5.d.ts#LL1571C2-L1572C3):

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
- [Try out these examples in TypeScript Playground](https://www.typescriptlang.org/play?#code/IYZwngdgxgBAZgV2gFwJYHsIwLbFRACgEoYBvAWACgYZkwAHAUxgFURGAnGAXjKppqoAJgC4YEBNgBGnANz8BEYNkZiQyDvgDm86gMa5UAGzUbtugTHqgQAd3QdRMdZog6FNDsDRuxE6XIeMByMAG6ojLYgpq5aANoAuhYwAL7JdEwwAOqoyAAW6AjIAAqcIJjARgCSEHDoPDDFqFAA1gA8bJwANDAARMK9MAA+fV4+WoMjvSHhkSC9AHzJAPTLMIwAjgiooZWMEMi06CIKGcw5+YUlZRXVtegATA2kMMJinRxx-UK9CT1j2ne7E+0282l+-zCEVsZSBnC+M2h8wSqV0pwYzGKHHQACtGFBDrwKHpBE5-DIOMkaEoVDFzEEhIwQFBNPQ0Jg6W4qTAhN5GABhEJ8pwAET53N5yEYLHoksYovFQTyoCqIBACCZYik6HQRkYwAg3OVIByLVQWp1eoN3IQwOirGBiWSKSoClWMAAsvhUNhJDzvMBxIx5fKjsFGPQQuwDjBA5HcfjkOjMl6ID7KliEwSGk1Wm1M3iCT1vpM+jTGItdC7KK7KIZCEQqEA)

### `Omit<Type, Keys>`

TODO

### `Exclude<UnionType, ExcludedMembers>`

TODO

### `Extract<Type, Union>`

TODO

### `NonNullable<Type>`

TODO

### `Parameters<Type>`

TODO

### `ConstructorParameters<Type>`

TODO

### `ReturnType<Type>`

TODO

### `InstanceType<Type>`

TODO

### `ThisParameterType<Type>`

TODO

### `OmitThisParameter<Type>`

TODO

### `ThisType<Type>`

TODO

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
