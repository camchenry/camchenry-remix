---
title: "Fast and Furious Functions: How React Hooks Left Classes In The Dust"
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
> &mdash; <cite>Microsoft C# guide, object-oriented programming</cite> [^3]

These are not the only terms for these concepts, but they are the ones that I have chosen because they are commonly used. I'm not going to cover these concepts in-depth since you can find many excellent books on them.

It's worth mentioning that there is a [fair amount of controversy over what "object-oriented" actually means](https://softwareengineering.stackexchange.com/questions/46592/so-what-did-alan-kay-really-mean-by-the-term-object-oriented). Regardless of what was originally meant, I am talking about the object-oriented style that has been adopted into many programming languages today.

Let's look at how these concepts are used today in a less object-oriented style.

## How functions implement the "object-oriented pillars"

The idea that these concepts could be implemented without using a "object-oriented language" is not new though. Alan Kay, known for pioneering much of the object-oriented programming concepts, said:

> Where does the special efficiency of object-oriented design come from? This is a good question given that it can be viewed as a slightly different way to apply procedures to data-structures. [...] Four techniques used together--persistent state, polymorphism, instantiation, and methods-as-goals for the object--account for much of the power. **None of these require an "object-oriented language" to be employed** [...]
>
> &mdash; Alan Kay [^4]

The essence of object-oriented programming doesn't rely on a particular language or feature, but it can help. The core ideas are universal and be executed in a number of different ways. In this article I'm just focusing on how functions can provide many of benefits that object-oriented programming offers.

### How functions provide encapsulation

Encapsulation is the fundamental concept of object-oriented style, sometimes also called "persistent state," or "information/data hiding." It is the idea of combining functions and data together into a single **object**. Encapsulation allows developers to enforce specific data access patterns, in other words, state is restricted to only changing in ways that are allowed. In most languages, this is done using _classes_. Some of the properties of encapsulation are:

- There are only predefined ways to access and change data
- Some data is private and cannot be changed from anywhere
- Implementation details are hidden from the user

### How functions provide inheritance

- functions calling functions

### How functions provide polymorphism

- function overloading (in some languages)
- if/else, switch/case

[^1]: https://docs.microsoft.com/en-us/dotnet/csharp/fundamentals/object-oriented/inheritance
[^2]: https://web.archive.org/web/20050404075821/http://gagne.homedns.org/~tgagne/contrib/EarlyHistoryST.html
