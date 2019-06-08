# <%= friendlyname %>

<%= (description || "About this project..." ) %>

<!-- MarkdownTOC levels="2,3,4" -->

1. [Requirements](#requirements)
1. [Installation](#installation)
1. [Configuration](#configuration)
1. [Commands & options](#commands--options)
    1. [Linting](#linting)
    1. [Tests \(Jest\)](#tests-jest)

<!-- /MarkdownTOC -->

---

## Requirements

1. [Git] version control system
2. [Node.js] JavaScript environment (`node`)
    - (Node install includes `npm`)
3. [Yarn] for dependency management
    - handling this through `npm` would also work; `npm` is a dependency of `yarn`

Many of the above are available through OS package managers, if you use them:

-   (macOS) [Homebrew] -- `brew install <PACKAGE_NAME>`
-   (Windows) [chocolatey] -- `choco install <PACKAGE_NAME>`

---

## Installation

Find a suitable location to install the project. Then...

1. Clone code repository `git clone https://GIT_REPOSITORY_LOCATION.git`
2. Move into the project directory with `cd NEW_PROJECT_DIRECTORY_NAME`
3. Install the project dependencies with `yarn` or `npm install`
4. Test-run the project `yarn SERVE_COMMAND`

---

## Configuration

Any other configuration notes...?

---

## Commands & options

As with any of these commands, if using `npm`, replace `yarn` with `npm run COMMAND_NAME`.

<% if (features.eslint) { %>

### Linting

JavaScript linting with [ESLint].

```shell
yarn lint
```

Initial [ESLint rules] are provided by shared sets:

-   `eslint-config-airbnb-base`
-   `eslint-config-prettier`

...and any overriding rules in `.eslintrc` file.

<% } %>
<% if (features.jest) { %>

### Tests (Jest)

This project uses [Jest] for unit-testing JavaScript.

```shell
# Run through the Jest unit-tests once
yarn test
yarn test --verbose # Output long-form test results
yarn test --findRelatedTests <spaceSeparatedListOfSourceFiles> # Target specific files

# Run tests & generate the Istanbul coverage report
yarn test:coverage

# Have Jest watch files, running tests when file changes are detected
yarn test:watch
```

For more commandline options see [Jest CLI options].

<% } %>

<!-- LINK REFERENCES -->

[chocolatey]: https://chocolatey.org/
[eslint]: https://eslint.org/
[eslint rules]: https://eslint.org/docs/rules/
[git]: https://git-scm.com/
[homebrew]: https://brew.sh/
[jest]: https://jestjs.io/
[jest cli options]: https://jestjs.io/docs/en/cli
[node.js]: http://nodejs.org
[npm]: https://www.npmjs.com/
[yarn]: https://yarnpkg.com/lang/en/
[yeoman]: https://yeoman.io/

<!-- end: LINK REFERENCES -->
