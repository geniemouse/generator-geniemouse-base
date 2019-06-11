# Base project generator

[Yeoman] generator that produces base project structure.

---

<!-- MarkdownTOC levels="2,3,4" -->

1. [Out-of-the-box](#out-of-the-box)
1. [Installation](#installation)
1. [Configuration](#configuration)
    1. [Sub-generators](#sub-generators)
1. [Related links](#related-links)

<!-- /MarkdownTOC -->

---

## Out-of-the-box

Accepting the default options ([ESLint], [Prettier], [Jest]), `geniemouse-base` adds the following packages (and rulesets):

-   [ESLint] for linting JavaScript files
-   [Jest] for unit-testing JavaScript
-   [Prettier] for formatting code

**Generated files**

```
.
├── __tests__/ *
├── .editorconfig
├── .eslintignore *
├── .eslintrc *
├── .gitattributes
├── .gitignore
├── .prettierrc.js *
├── .prettierignore *
├── package.json
├── CHANGELOG.md
└── README.md

* Installed only if related package is.
```

---

## Installation

Install [Yeoman] \(`yo`\) & `generator-geniemouse-base` globally.

```shell
# Using npm:
npm install --global yo generator-geniemouse-base

# Using yarn:
yarn global add yo generator-geniemouse-base
```

---

## Configuration

1. Make a project directory and `cd` into it

```shell
mkdir YOUR_PROJECT_NAME && cd $_
```

2. Call on `yo` to create the scaffold from `geniemouse-base` generator

```shell
yo geniemouse-base
```

(Calling `yo` on its own lists all the installed generators, which can be selected and run from there.)

3. Yeoman will run through a series of questions; customize the choices, as you see fit.

### Sub-generators

Each of the project features is available as a sub-generator, which can be called individually:

```
# ESLint install
yo geniemouse-base:eslint

# Jest install
yo geniemouse-base:jest

# Prettier install
yo geniemouse-base:prettier
```

---

## Related links

-   Read more about [Yeoman generators]?
-   Full [Yeoman API]

<!-- LINK REFERENCES -->

[eslint]: https://eslint.org/
[jest]: https://jestjs.io/
[prettier]: https://prettier.io/
[yeoman]: https://yeoman.io/
[yeoman api]: https://yeoman.github.io/generator/
[yeoman generators]: https://yeoman.io/generators/

<!-- end: LINK REFERENCES -->
