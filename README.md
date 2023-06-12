# eslint-plugin-no-data-blocks

Do not embed large data in code

## Installation

You'll first need to install [ESLint](https://eslint.org/):

```sh
npm i eslint --save-dev
```

Next, install `eslint-plugin-no-data-blocks`:

```sh
npm install eslint-plugin-no-data-blocks --save-dev
```

## Usage

Add `no-data-blocks` to the plugins section of your `.eslintrc` configuration file. You can omit the `eslint-plugin-` prefix:

```json
{
    "plugins": [
        "no-data-blocks"
    ]
}
```


Then configure the rules you want to use under the rules section.

```json
{
    "rules": {
        "no-data-blocks/no-data-blocks": ["error", 100]
    }
}
```

## Rules

<!-- begin auto-generated rules list -->

| Name                                           | Description                     |
| :--------------------------------------------- | :------------------------------ |
| [no-data-blocks](docs/rules/no-data-blocks.md) | Do not embed large data in code |

<!-- end auto-generated rules list -->
