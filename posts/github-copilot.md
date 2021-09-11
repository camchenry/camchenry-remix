---
title: "Why I'm Not Worried About GitHub Copilot Taking My Software Job"
summary: "Tools like Copilot are extremely powerful natural language interfaces for writing code, but there are very real limitations to it, as well as legal and ethical issues. Ultimately, it is a tool for developers, not a replacement for a developer."
publishedAt: "2021-09-11"
tags:
  - ai
  - programming
---

I've been using GitHub Copilot as a coding assistance tool to write TypeScript code everyday for the past two months. After two months, I think I have a pretty good idea of what it's like to use GitHub Copilot for everyday engineering. So, what's my conclusion on AI taking my job as a software engineer? I'm not concerned that AI will take my job as a software engineer. In fact, I think it's a great tool that will help developers write all kinds of software.

To understand why I'm not concerned, and even excited about Copilot, let's go through the good, the bad, and the ugly parts of Copilot.

## Copilot: the good

### Excellent pattern recognition and completion

Copilot is really good at following a pattern when given examples, or inferring common patterns when using widely-used libraries and languages. It normally does take more than an example or two to start generating the code that I'm looking for. This has come in handy when generating things like testing data, where I want lots of random data with the same form.

This has also slightly changed the way that I actually write code. I will write detailed definition of a function (more than I would normally write) before I wrote the actual implementation. This gives Copilot the context for what I am trying to write. If Copilot can understand my code and automatically write it for me, then that's usually a good sign that a human developer will be able to understand it easily too.

Here's an example input that surprised me with how well Copilot was able to complete it. Input:

```typescript
const partition = <
```

Copilot output:

```typescript
const partition = <T>(
  array: T[],
  predicate: (value: T) => boolean
): [T[], T[]] => {
  const result = array.reduce(
    ([pass, fail], value) =>
      predicate(value) ? [[...pass, value], fail] : [pass, [...fail, value]],
    [[], []]
  );
  return [result[0], result[1]];
};
```

Wow! Just based on the name alone, Copilot was able to infer what I wanted to do and write the implementation accordingly. It's not exactly as I would have written it, but thankfully all it takes is a little nudge in the right direction (adding some of my own code) to generate new options.

### Creative solutions

Since Copilot understands not only computer code, but also human languages, we can give it some unique challenges and ask it to generate a solution.

Here is an example challenge to check if a number is even, but without using a normal solution.

**Input**:

```typescript
// Checks if a number is even, but in an unconventional way
// that does NOT use the modulus (%) operator at all.
const isEven = (n:
```

**Output**:

```typescript
// Checks if a number is even, but in an unconventional way
// that does NOT use the modulus (%) operator at all.
const isEven = (n: number): boolean => {
  if (n === 0) {
    return true;
  }
  return isOdd(n - 1);
};

const isOdd = (n: number): boolean => {
  if (n === 0) {
    return false;
  }
  return isEven(n - 1);
};
```

Neat! Copilot generated a recursive solution to check if a number is even. It's not efficient, but it's also not something that I would have thought to use immediately.

## Copilot: the bad

### Too eager to infer patterns

Often times, Copilot recognizes a pattern based on or two data points and then tries to write a lot of code base on that pattern. Usually, this is a bad assumption and results in not very good suggestions. In addition, there doesn't seem to be a "common sense" threshold for when to stop suggesting code.

Here is an example where we're defining a specification for a simple password validation function:

**Input**:

```typescript
// This function validates a password according to the following rules:
```

**Output**:

```typescript
// This function validates a password according to the following rules:
// - It must be at least 8 characters long
// - It must contain at least one digit
// - It must contain at least one uppercase letter
// - It must contain at least one lowercase letter
// - It must contain at least one special character
// - It must NOT contain whitespace
// - It must NOT contain the word "password"
// - It must NOT contain the word "admin"
// - It must NOT contain the word "user"
// - It must NOT contain the word "root"
// - It must NOT contain the word "pass"
// - It must NOT contain the word "123456"
// - It must NOT contain the word "123456789"
// - It must NOT contain the word "12345678"

/* ... and so on, you get the idea */
```

It does a great job of recognizing the pattern initially, but eventually gets stuck in an infinite loop of suggesting to add more restricted words unless I intervene. To its credit though, given the right prompting, it will generate a function that actually validates the generated rules.

### Not context-aware

One issue that I run into frequently is: when writing test code, I'm writing more-or-less the same sort of code, but Copilot isn't able to infer patterns across files. Once I've written at least one example test in the file, Copilot is able to start autocompleting, but I wish that it was able to infer across multiple files (that is, look at all my `*.test.ts` files) and suggest code based on that.

In addition, sometimes Copilot will suggest code that is completely valid, but totally wrong. For example, if I ask it to do something that looks like an Angular project, it will generate a bunch of imports for Angular libraries and patterns, even though I'm using React and _I do not reference Angular anywhere at all_.

## Copilot: the ugly

### The legal and ethical implications

Probably the biggest controversy surrounding Copilot is its legal and ethical implications for using it for software development. Most of this revolves around the fact that Copilot is trained on publicly available datasets. This means that [Copilot can regurgitate secret API keys](https://www.theregister.com/2021/07/06/github_copilot_autocoder_caught_spilling/) that were accidentally leaked, or [generate licensed code](https://twitter.com/alexjc/status/1410524416660889607), which GitHub considers "fair use."

Personally, I have not experienced any of these issues. However, just because I haven't personally experienced it, doesn't mean that it isn't a problem. (That is true of _many_ things). We must consider the impact that normalizing this behavior will have. I don't know what the solution is, so I will defer to experts on that one. I think this is the biggest problem that must be solved before this can be widely adopted.

## Conclusion

Overall, I am excited by AI code completion like GitHub Copilot. The natural language interface of Copilot is powerful, and allows infinitely more possibilities than something like [IntelliSense](https://code.visualstudio.com/docs/editor/intellisense) alone. The legal/ethical issues surrounding it make me hesitant to keep using it though. I think if these issues could be overcome, I would be more likely to recommend it to everyone. For the time being though, I am much more positive on AI code completion tools like [TabNine](https://www.tabnine.com/) in general. I think that they hold a lot of promise, especially as a tool for newer developers.

For now though, I'm not worried about Copilot taking my job (yet).
