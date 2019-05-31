# Base project generator

[Yeoman] generator that produces base project structure.

---

<!-- MarkdownTOC levels="2,3,4" -->

1. [Out-of-the-box](#out-of-the-box)
1. [Installation](#installation)
1. [Configuration](#configuration)
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
├── __tests__/
├── .editorconfig
├── .eslintignore
├── .eslintrc
├── .gitattributes
├── .gitignore
├── .prettierignore
├── package.json
├── CHANGELOG.md
├── README.md
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

---

## Related links

-   Read more about [Yeoman generators]?

<!-- LINK REFERENCES -->

[eslint]: https://eslint.org/
[jest]: https://jestjs.io/
[prettier]: https://prettier.io/
[yeoman]: https://yeoman.io/
[yeoman generators]: https://yeoman.io/generators/

<!-- end: LINK REFERENCES -->
