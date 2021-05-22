---
title: "Performing Surgery on Types with Modify"
summary: "The Modify type can be used to replace properties in types, which can be useful when working with libraries that have non-generic types."
publishedAt: "2021-05-20"
---

If you would like to follow along this article's code: [TypeScript playground](https://www.typescriptlang.org/play?#code/JYWwDg9gTgLgBAJQKYEMDG8BmUIjgIilQ3wG4AocmATzCTgFkIATYTagHgBVakAaREjAAbdEgB8cALxwA8iGAxuvAQGsk1CJkEixkgGQ7RaJBSq84ABSRQAzhAB20uAG9ycOA5QgkALji2MFDADgDmFB4ooX6eAK4gAEY2EXAozMxEtrb+gcFhFAC+ZjR0RmLOLqnpmdkBQSGhcAA+cBAJAFZIGHBFlCX0AILO8ooc1naOahpaZSbipHAA9ItwQzKVXj459fmp0f4O8UlQCwXmpQBCzsi6JgvLcFfrVRlIWdt5jS1tnRin5-QmKxMMAkMxnENDBd7isgWxQeDnpsYrkGgsojFDolki8ah8Gs1Wh0ujB-uQHgN4DAABbAWxwSAhGACOEgsHSGSszjjewOAQ3YwSchoRyBBk2XkVdyebwxfAwN4wfB8aUY-wAZgADCrItU3rVKrkkEgYP58ABGABM6rgSAAHt4RPQjSb8D0Vb0HhcIDTUkQ5ABpXzC0XwOgTBzm-yshHOcO8igihxi+OOS3RlhsbkSyazCRxnMOMwPKSlsvliuVqvVyvklYDMBgW0O8DCJB1jk1rvdruUB4AdUU1IgsXgXI7PcnU7LlCZNkw5S4tKgzEsKFg1AAkgq8G4PA8AHKy1raGn0RRIEDS5H4-LSh5LulwZgoGAoOBoFBOJKpBzUGkEposRwAA7l+zJwIoADk9LtLEYooFkEBoMAr5gveKwgUOcBnpBO4CAko6eD6cDweyIS-tQoEoNQ0ovm+-hftQhSzg4CpQAuJhwI+K5rhuAAydIwJYOBgPSe54ZetQ8au640Nul4ANoALopI4ADCwjAGgqgAPz+AAFBeID+DJfHyTuACU0iSAAbhAwDMCx5CYLEDgYMAjjccuskCUJBmVMZ9IFKZPnmdQgmBCJEBidZElEDAsRQE4HCsLZSzzEs9ZZPE9AAfSrnuTAnlOOgiUoMIwhUVpgTsiOVLUueO70tAAS4CatJhOQZwhsmWBQLEigACKvigCSIfQ6yqo2bb+JUIrCNAZpEMwboFDqcDjV4XhzR+ECLVAZrUEglUQCBa0baEUAoHQu0LUtBBgElToXd1xYrFw13Jpg0B4COUBwNgg3wPRY0TZBbEQKkgO-Th1Kvh+X6bfQSa2Ll4IJFRZ4dvg6orgycnUG6IrgI4SBsaB9DrvQ8ENL1YpA4o9IyLIxIYAAdOT9RvAZjMwCNb7jbYSCWezIA3QZBmKXzR4+AIIQ-cp1lSJIAXXrK-gy7KG2g-4CsQB6lmWWYhUeV5DZgOaBlxRhcAAAIwLYAC09p0BgLtQDgh3cRYtgoJgJpUSB0CqLYACE3n0GAok2DQcAAAaIcwmDx5Bti2w4jgu3aQlc60Ti4XzEM-VA4vFV5-Ts9KqP7Ug7OLaEvMDUzimasp7Og+zSeYMblAeAlSVOAZ0oeNwYWE5FMAjx4kkgLYUguHzthnDPM8PLIsiWAAyhHB5QzYXvs3A-b0ItYr-Thvv+4HcCNf6SSfmRcN5T5BMbtP+4rCTkAOHnIG0mgakpFhb0njqDVOiEE5MXjh-fOmltKqAXk3YGytJA1zbPXCAjc+Yd1Gl3WwydLIrzXuIaUvceoPAAKq2AJOOEs04GG9gBHABSIAOACxQJITkmZ2AcGlGZQmrCNoSQ8LrOAHCUhnHmH0Cwk9opiXYaNLhjAeGcH4ePPyUVRK2GEdPIK-hWGKLfOIFSKQPAaS0jpfScAjI7gMTuIxnDUFwHso5SR5BpEdn7NdRsNg9qk1-hTGAUNxbqGhtEX+wQ0AuIlCVE83lgC8QnkJFybkzZOEntwcQBlo4xVqHI7RWSbb9xNIPOAY9Em+RoJPVw7M6m5LEgUDKzlTblycBbS01tXC2wds7V2JIPZe1MlfAOcdg5QFDhHJcUcY4bigQQlOacM5Z3tLnCmFdGqA2bvAfWpdXxxMrtXUUtdMHYO2bYVu7dO7d17tKAeyUbHTw4JPWBQUF5L2IavB4vTs5uxgIMh6PBSh+1GUHEO9IogoBCFMzZ-R4lgNGjA1en807FwPuybAuAE5BSRciixCCkF82ceguuDdkGKFwW+fBhDPkZTISxIAA).

## The Modify Type

```typescript
type Modify<Type, Replace> = Omit<Type, keyof Replace> & Replace;
```

Let's break down what this type does. First, it accepts two arguments: `Type` and `Replace`. `Type` is the thing
that will have modifications done to it. `Replace` is what modifications will be made to `Type`.

The `Omit<Type, keyof Replace>` removes all properties from the `Type` which are going to be modified. `Omit` is a
[built-in utility type](https://www.typescriptlang.org/docs/handbook/utility-types.html#omittype-keys) to TypeScript.
Then, the `& Replace` re-adds the modified types the resulting type from `Omit`, which results in an object that
has exactly the same type, but with only specific types replaced.

Let's look at an example of modifying a `Person` type.

### Modify Example

```typescript
type Person = {
  name: string;
  age: number;
  address: string;
};
```

Suppose that we want to change the `address` property to allow for an `object`, which might contain more in-depth
address information such as street address, country code, province/state, etc.

```typescript
// The modifications that we want to make to the `Person` type
type Replace = { address: string | object };

type A = Omit<Person, keyof Replace>; // A = { name: string; age: number; }
type B = Replace; // B = { address: string | object; }
type Modified = A & B; // Modified = { name: string; age: number; address: string | object; }

// At this point, Modified == Modify<Person, Replace>

const person: Modified = {
  name: "test",
  age: 30,
  address: { street: "123 example street" },
};
```

Without showing the intermediate types, here is what the same example might look like in a more real-world usage:

```typescript
type ModifiedPerson = Modify<Person, { address: string | object }>;
const person: ModifiedPerson = {
  name: "test",
  age: 30,
  address: { street: "123 example street" },
};
```

## Using Modify With 3rd Party Code

The main value of `Modify` is being able to modify any type and change only the things that you need, even if that
type comes from somewhere else (like a library). You can create an interface which wraps over 3rd party types and provides
greater safety as opposed to using `any` or casting to other types.

### Library Example

To show how `Modify` can be used for working with libraries, let us take a look at a theoretical example of how this
might be used in an application. Suppose that we are using a library to list out some items. But, the types of the
library use `any` in a few places, and it is not generic, so we cannot add our own types.

```tsx
interface ThirdPartyItem {
  // Name of the item
  name: string;
  // This data can be anything you want, it's just associated
  // with the item, but not used in any way
  data: any;
}

interface ThirdPartyListProps {
  items: ThirdPartyItem[];
  onClick?: (item: ThirdPartyItem) => void;
}

function ThirdPartyList({ items }: ThirdPartyListProps) {
  return <div />; // Assume this function actually listed out the items
}
```

All of the code that comes from the library is prefixed with `ThirdParty`, to show that we cannot change it. The
`ThirdPartyList` component accepts an array of items, and a click event handler for when the user clicks on an item.

However, we will now see how the `any` type for the `data` property can cause some type safety problems.

```tsx
const fruitDatabase = {
  apple: { color: "red" },
  banana: { color: "yellow" },
  grape: { color: "purple" },
};

// Transform our fruit database into a form that can be consumed by the
// "3rd party" component we are using
const fruits = Object.entries(fruitDatabase).map(([fruitName, info]) => ({
  name: fruitName,
  data: info,
}));

function App() {
  // @ts-expect-error: Type safety works! The property `asdf` is
  // non-existent on the fruit information type.
  console.log(fruits[0].data.asdf);

  return (
    // OOPS! No error in `onClick`. We lost our type safety here because the third party
    // component which uses `data` as `any`
    <ThirdPartyList
      onClick={(fruit) => console.log(fruit.data.asdf)}
      items={fruits}
    />
  );
}
```

When we access `fruits[0]`, TypeScript can infer the full type and ensure we cannot misuse the object. On the other
hand, when we access the `fruit` argument in the `onClick` handler, the type is given by the definition of `ThirdPartyItem`
which has `data` typed as `any`.

It would be great if we could just change the relevant props of `ThirdPartyList` to be generic so that TypeScript
could infer all of the types and prevent us from making a mistake. We can do exactly that with `Modify`!

```tsx
// Create a generic version of `ThirdPartyItem` that removes the `any` type
type Item<Data> = Modify<ThirdPartyItem, { data: Data }>;

// Update the relevant props which use the item type
type ListProps<Data> = Modify<
  ThirdPartyListProps,
  {
    items: Item<Data>[];
    onClick?: (item: Item<Data>) => void;
  }
>;

// Wrapper component to make a generic version of ThirdPartyList
function List<T>(props: ListProps<T>) {
  return <ThirdPartyList {...props} />;
}
```

First, we create a generic version of the library's item type which has the generic `Data` type instead of `any`. This
allows TypeScript to infer the type based on what we pass in to the component.

Next, we modify the component's props that used the previous item type and allow them to be generic also. In this particular
case, we actually redefined the entire interface. For many components though, most props will not need to be modified.

Lastly, we create a generic wrapper component which allows us to use `ThirdPartyList` in a way that TypeScript can infer
all of the types. Now, returning to our application code from before, we can just update it to use the new component:

```tsx
function App() {
  // @ts-expect-error: Type safety still works here to prevent using `asdf`
  console.log(fruits[0].data.asdf);

  return (
    // @ts-expect-error: Type safety works now!
    // The type of `data` is inferred from `items`
    <List onClick={(fruit) => console.log(fruit.data.asdf)} items={fruits} />
  );
}
```

The type of `data` is inferred from the data passed in to the `items` property, and TypeScript prevents us from accessing
a property which does not exist.

## Caveats

Modify is useful for overriding external types from libraries and creating safe wrappers around them, but it should not
be the first thing to try.

If it is available, it is better to use a generic interface from the library that allows you to accomplish the same thing. Using
`Modify` means maintaining an additional interface every time that the underlying library type updates too. Even more dangerously,
since we are _replacing_ types, some type changes can actually be overridden accidentally if you do not pay attention
when updating dependencies.

There are a number of benefits to using `Modify` though:

- Prevents the need to cast with `as` each time you need to access a property of type `any` or `unknown`
- Can be easily removed or changed in a single place if the library adds a generic interface later

## Conclusion

The `Modify` type can be extremely useful for working with external library types and code that do not quite have
the correct types. Instead of completely abandoning type safety, we can use `Modify` to build safe wrappers around
just the pieces of code that are problematic.
