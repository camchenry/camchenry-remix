---
title: "How Functions Have Replaced Object-Oriented Programming in React"
summary: "TODO: Summary"
publishedAt: "9999-01-01"
tags:
  - oop
  - javascript
---

Java. C#. JavaScript. Python. Ruby. PHP. C++. All of these languages were designed to support object-oriented programming in some way.

In the 1990s and 2000s, object-oriented programming was one of _the_ guiding principle behind almost every programing language.

Today, many programming communities discourage it, and some programming languages don't even support it.

What happened to object-oriented programming?

Originally, React used classes to implement components, but [Hooks](https://reactjs.org/docs/hooks-intro.html) changed that. I haven't used classes in JavaScript for the last few years. Instead, I have written a lot of something else: functions.

I think that in place of classes, **we have figured out how to combine the best of imperative and functional programming** in a way that has replaced object-oriented programming. In this post, we'll examine some of the major tenets of object-oriented programming and how they have been replicated using functions through the lens of React Hooks.

## The "Pillars of OOP"

In almost any programming textbook on modern object-oriented programming you'll find several major principles behind OOP:

- Encapsulation
- Inheritance
- Polymorphism

> Inheritance, together with encapsulation and polymorphism, is one of the three primary characteristics of object-oriented programming.
>
> &mdash; <cite>Microsoft C# guide, object-oriented programming</cite> [^1]

These are not the only terms for these concepts, but I chose these ones because they are common and _encapsulate_ the core concepts. We'll use these as a guide for comparing functions and classes.

<div class="note">
It's worth mentioning that there is a <a href="https://softwareengineering.stackexchange.com/questions/46592/so-what-did-alan-kay-really-mean-by-the-term-object-oriented">fair amount of controversy over what "object-oriented" actually means</a>. Regardless of what was originally meant, I am talking about the object-oriented style that has been adopted into many programming languages today.
</div>

## How functions implement the "object-oriented pillars"

The idea that these concepts could be implemented without using a "object-oriented language" is not new though. Alan Kay, known for pioneering object-oriented programming concepts, said:

> Where does the special efficiency of object-oriented design come from? This is a good question given that it can be viewed as a slightly different way to apply procedures to data-structures. [...] Four techniques used together--persistent state, polymorphism, instantiation, and methods-as-goals for the object--account for much of the power. **None of these require an "object-oriented language" to be employed** [...]
>
> &mdash; Alan Kay [^2]

The essence of object-oriented programming doesn't rely on a particular language or feature, but it can help. The core ideas are universal and be executed in a number of different ways. In this article, we are focusing on how **functions can provide many of benefits that object-oriented programming offers**.

### How functions provide encapsulation

Encapsulation is the fundamental concept of object-oriented style, sometimes also called "persistent state," or "information/data hiding." It is the idea of combining functions and data together into a single **object**. Encapsulation allows developers to enforce specific data access patterns, in other words, state is restricted to only changing in ways that are allowed. In most languages, this is done using _classes_. Some of the properties of encapsulation are:

- There are only predefined ways to access and change data
- Some data is private and cannot be changed from anywhere
- Implementation details are hidden from the user

When using classes, this is implemented in a few different ways:

- Getters/setters methods on objects
  - Getters enforce how data is _accessed_
  - Setters enforce how data is _changed_
- Private/protected variables cannot be accessed from outside of the class

When using functions, there are no "instance variables" because state does not persist. However, there are other ways to implement the same ideas, like using immutable data structures, or global state management.

#### Immutable data

Immutable data structures are constant and cannot be changed, but new copies can be created with updated values. This ensures that data is not changed arbitrarily and that the data is only changed in well-defined ways. Both of these are consistent with the idea of encapsulation. In JavaScript, there are utilities and libraries like [Object.freeze](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze) and [Object.seal](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/seal) that can be used to create immutable data structures. Libraries like [Immer](https://immerjs.github.io/) make it easy to create functions that update state predictably and efficiently.

#### State functions

Another method of recreating encapsulation in functions is to use some sort of state management tool to simulate instance variables. The most well known example of this is React's [`useState`](https://reactjs.org/docs/hooks-reference.html#usestate) function. It relies on global state and a [strict set of rules](https://reactjs.org/docs/hooks-rules.html) in order to provide a similar abstraction to instance variables in classes.

Compare these two nearly equivalent code examples. First, the object-oriented / class version:

```javascript
class Counter {
  constructor() {
    this.count = 0;
  }
  getCount() {
    return this.count;
  }
  increment() {
    this.count = this.count + 1;
  }
  decrement() {
    this.count = this.count - 1;
  }
}
```

Then, the same code but written using only functions:

```typescript
function useCounter() {
  const [count, setCount] = useState(0);
  const increment = () => setCount(count + 1);
  const decrement = () => setCount(count - 1);
  return { count, increment, decrement };
}
```

These two pieces of code are nearly equivalent. They both define some sort of counter object which can be incremented, decremented, and also give the current count.

What's different though, is how these are implemented. The first example uses classes, methods, and instance variables to implement the stateful counter.

The second example uses a function to create the object, then uses the `useState` function to create a stateful variable, and defines state changes with other functions.

One of the benefits of using state functions is that the mental model is much simpler because you only need to think about functions. It's also easier to compose, which brings us to the next OOP pillar: inheritance.

### How functions provide inheritance

In object-oriented programming, inheritance is the idea of creating objects which inherit their properties from other objects. This is typically done to allow for code to be reused and modified for specific cases. Since JavaScript supports object-oriented programming as a paradigm, this can be done with the `extends` keyword when defining a class.

On the other hand, functions do not have any sort of native inheritance capabilities or special keywords. Instead, the property of "inheritance" is accomplished by composing together different functions. This goes along with the idea that we should [prefer composition over inheritance](https://stackoverflow.com/questions/49002/prefer-composition-over-inheritance) when possible.

### How functions provide polymorphism

- function overloading (in some languages)
- if/else, switch/case

[^1]: https://docs.microsoft.com/en-us/dotnet/csharp/fundamentals/object-oriented/inheritance
[^2]: https://web.archive.org/web/20050404075821/http://gagne.homedns.org/~tgagne/contrib/EarlyHistoryST.html

```

```
