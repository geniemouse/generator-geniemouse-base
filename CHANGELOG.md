# Change log

## v2.0.1

_13 June, 2019_

-   Hotfix for `npm` publish missing-out `.gitignore` file. Renamed all dot-file templates

## v2.0.0

_13 June, 2019_

-   Update generators & sub-generators to use `.yo-rc.json` file to store/share set-up information
-   Remove duplication of prompt questions between main and Prettier sub-generator
-   Remove prompt questions from the ESLint sub-generator. If ESLint is already installed, running the Prettier or Jest sub-gnerators automatically re-runs ESLint to update its configuration
-   Messaging functionality refactored

---

## v1.3.0

_11 June, 2019_

-   Generator now includes sub-generators for separate package features: `eslint`, `jest` & `prettier`

---

## v1.2.0

_05 June, 2019_

-   Updated unit-tests

---

## v1.1.0

_05 June, 2019_

-   Added unit-tests
-   Release skipped in favour of _v1.2.0._

---

## v1.0.0

_04 June, 2019_

-   Initial release

<!-- LINK REFERENCES -->

[npm]: https://www.npmjs.com/

<!-- end: LINK REFERENCES -->
