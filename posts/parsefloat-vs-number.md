---
title: "parseFloat vs Number: What's the Difference?"
summary: "TODO: Summary"
publishedAt: "9999-01-01"
tags:
  - javascript
---

## What's the Same

### Producing Numbers

#### Floats

#### Integers

## What's Different

### parseFloat: Stops When Input Stops Making Sense

### Number: Parses Hexadecimal and Binary

### Number: Parses Whitespace as Numbers

### Example Inputs and Outputs

| Input (`x`)  | `parseFloat(x)` | `Number(x)` |
| ------------ | --------------- | ----------- |
| `'120'`      | 120             | 120         |
| `'-9.8'`     | -9.8            | -9.8        |
| `'.3'`       | 0.3             | 0.3         |
| `'0'`        | 0               | 0           |
| `'f'`        | NaN             | NaN         |
| `'0xc0ffee'` | 0               | 12648430    |
| `''`         | NaN             | 0           |

## a | b

### Honorable Mention: parseInt

## Conclusion
