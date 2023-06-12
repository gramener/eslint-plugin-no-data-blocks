# Do not embed large data in code (`no-data-blocks/no-data-blocks`)

<!-- end auto-generated rule header -->

Keep data and code separate, encouraging small code and more data.

Developers sometimes embed data or configuration in their code. For example:

```js
const data = [
  { city: "Oslo", sales: 10, profit: 2, margin: 0.20 },
  // ... dozens of other records
];
```

This encourages future developers to introduce logic. For example:

```js
const data = [
  // Round margin to two decimal places
  { city: "Oslo", sales: 10, profit: 2, margin: Math.round(2 / 10 * 100) / 100 },
  // ... dozens of other records
];
```

Logic grows complex and is difficult to test and maintain.

This rule encourages developers to keep data and code separate (and use more data than code) by
loading data from an external source.

## Rule Details

This rule reports an error if an array or object has more than a specified number of elements.

Examples of **incorrect** code for this rule:

```js
const data = [
  { city: "Oslo", sales: 100, growth: 0.2, profit: 10 },
  // ... dozens of other records
];
```

Examples of **correct** code for this rule on the browser are:

```js
const data = await fetch("data.json").then((r) => r.json());
```

... or on the server are:

```js
const data = JSON.loads(fs.readFileSync("data.json"));
```

### Options

This rule has one integer option: the minimum number of literals that triggers the rule.

By default, this rule will trigger on any array or object with more than 100 elements.

To change the minimum to 50 elements, use:

```json
{
  "rules": {
    "no-data-blocks/no-data-blocks": [2, 50]
  }
}
```

## When Not To Use It

Do not use this rule if:

- You cannot load the data from an external source
- You cannot use a build tool to compile the data into the source code
