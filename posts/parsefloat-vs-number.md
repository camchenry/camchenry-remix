---
title: "parseFloat vs Number: What's the Difference?"
summary: "Picking a function to use for parsing numbers can be a confusing question to answer, so let's take a look at what exactly are the differences and similarities between these two functions."
publishedAt: "2021-06-23"
tags:
  - javascript
type: "guide"
---

Parsing numeric inputs is a task that comes up frequently when creating web applications. Typically, it comes up when
we need to obtain a number from some text that represents a number, often specified by the user via an `<input>` tag
like `<input type="number">` or `<input type="text">`.

`parseFloat` and `Number` are two of the most common ways to accomplish this task, but the differences between them
are nuanced, so let's see how they are similar and how they differ.

## What's the Same

At a glance, both `parseFloat` and the `Number` constructor generally do the same thing. They can each:

- produce numbers from values
- handle exponents (like `4.5e3`)
- handle decimals (like `-9.8`)

If the input is strongly validated already to ensure that there's nothing radical (like `NaN`, non-number types, etc.)
then you will not likely not see much of a difference between the two functions. Where it gets interesting though is
how each of these functions handles more exotic inputs.

## What's Different

### parseFloat: Stops When Input Stops Making Sense

`parseFloat` will only parse an input up to the point where it stops making sense, and return that number. For example,
numbers with units after the number can be parsed because the number comes before the unit:

```js
parseFloat("3px"); // => 3
parseFloat("9,59 €"); // => 9
```

On the other hand, `Number` will try to parse the whole value as a number, including any text:

```js
Number("3px"); // => NaN
Number("9,59 €"); // => NaN
```

### Number: Parses Hexadecimal and Binary

In addition to parsing decimal numbers (base 10), the `Number` constructor can also parse binary (base 2), octal (base 8),
and hexadecimal (base 16) numbers. Binary numbers are prefixed with `0b`, octal numbers are prefixed with `0o`, and
hexadecimal numbers are prefixed with `0x`.

```js
Number("101"); // => 101
Number("0b101"); // => 5
Number("0o101"); // => 65
Number("0x101"); // => 257
```

`parseFloat` doesn't parse binary, octal, or hexadecimal numbers:

```js
parseFloat("101"); // => 101
parseFloat("0b101"); // => 0
parseFloat("0o101"); // => 0
parseFloat("0x101"); // => 0
```

### Number: Parses Whitespace and Booleans as Numbers

The Number constructor treats whitespace as an acceptable input and will return a number. If there is a number contained
within the whitespace, it will be parsed and returned.

```js
Number(""); // => 0
Number("\n"); // => 0
Number("\t"); // => 0
Number("\t501\n"); // => 501
```

`parseFloat` will not accept whitespace as an acceptable input, unless it contains a number.

```js
parseFloat(""); // => NaN
parseFloat("\n"); // => NaN
parseFloat("\t"); // => NaN
parseFloat("\t501\n"); // => 501
```

In addition to whitespace, `Number` will also parse booleans as numbers, whereas `parseFloat` will not.

```js
Number(true); // => 1
parseFloat(true); // => NaN
```

### Example Inputs and Outputs

To illustrate the similarities and differences above, I've computed some typical and atypical inputs and listed
the outputs for both `parseFloat` and `Number`.

| Input (`x`)         | `parseFloat(x)` | `Number(x)` |
| ------------------- | --------------- | ----------- |
| `'120'`             | 120             | 120         |
| `'-9.8'`            | -9.8            | -9.8        |
| `'8.988e9'`         | 8988000000      | 8988000000  |
| `'.3'`              | 0.3             | 0.3         |
| `'0'`               | 0               | 0           |
| `42` (number)       | 42              | 42          |
| `'f'`               | NaN             | NaN         |
| `'-Infinity'`       | -Infinity       | -Infinity   |
| `'0xc0ffee'`        | 0               | 12648430    |
| `'0b1010'`          | 0               | 10          |
| `'0o4000'`          | 0               | 2048        |
| `''` (empty string) | NaN             | 0           |
| `[]` (array)        | NaN             | 0           |
| `{}` (object)       | NaN             | NaN         |
| `true` (boolean)    | NaN             | 1           |
| `\n\t` (whitespace) | NaN             | 0           |

## Conclusion

Both `parseFloat` and `Number` can produce numbers from typical strings that represent numbers, but both have some caveats
which have to be handled regardless of which you choose, such as parsing non-numeric inputs (like booleans, objects, arrays),
as well as atypical inputs (like octal numbers and whitespace).

However, neither `parseFloat` nor `Number` will pass judgement on what constitutes a "valid" number. Any implementation
that uses one of these functions should consider the following and validate accordingly:

- Should only finite numbers be allowed? (See [`Number.isFinite`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isFinite))
- Should only integers be allowed? (See [`Number.isInteger`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isInteger))
- Should non-decimal numbers be allowed?

In general though, `Number` is a good default choice to use for parsing numbers. Ultimately, any number parsing code
should be thoroughly tested to ensure it works as expected, regardless of whether `Number` or `parseFloat` are used.
