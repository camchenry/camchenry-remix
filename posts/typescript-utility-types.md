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

TODO

### `Record<Keys, Type>`

TODO

### `Pick<Type, Keys>`

TODO

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

TODO

### `Lowercase<StringType>`

TODO

### `Capitalize<StringType>`

TODO

### `Uncapitalize<StringType>`
