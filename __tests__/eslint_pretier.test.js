const path = require("path");
const helpers = require("yeoman-test");
const assert = require("yeoman-assert");

const app = "../app";

describe("ESLint & Prettier:", () => {
    describe("On:", () => {
        beforeAll((done) => {
            helpers
                .run(path.join(__dirname, app))
                .withPrompts({
                    directories: [],
                    features: ["hasESLint", "hasPrettier"]
                })
                .on("end", done);
        });

        test("creates feature files", () => {
            assert.file([".eslintignore", ".eslintrc", ".prettierignore"]);
        });

        describe("package.json file", () => {
            test("scripts has the expected commands", () => {
                assert.jsonFileContent("package.json", {
                    scripts: {
                        lint: "eslint ./"
                    }
                });
            });

            test("devDependencies has the expected packages", () => {
                assert.jsonFileContent("package.json", {
                    devDependencies: {
                        "@geniemouse/prettier-config": "^1.1.3",
                        "eslint": "^5.16.0",
                        "eslint-config-airbnb-base": "^13.1.0",
                        "eslint-config-prettier": "^4.3.0",
                        "eslint-plugin-import": "^2.17.3",
                        "eslint-plugin-prettier": "^3.1.0",
                        "prettier": "^1.17.1"
                    }
                });
            });
        });
    });

    describe("Off:", () => {
        beforeAll((done) => {
            helpers
                .run(path.join(__dirname, app))
                .withPrompts({
                    directories: [],
                    features: [],
                    hasESLint: false,
                    hasPrettier: false
                })
                .on("end", done);
        });

        test("does not create feature files", () => {
            assert.noFile([".eslintignore", ".eslintrc", ".prettierignore"]);
        });

        describe("package.json file", () => {
            test("scripts has the expected commands", () => {
                assert.jsonFileContent("package.json", {
                    scripts: {
                        lint: undefined
                    }
                });
            });

            test("devDependencies has the expected packages", () => {
                assert.jsonFileContent("package.json", {
                    devDependencies: {
                        "@geniemouse/prettier-config": undefined,
                        "eslint": undefined,
                        "eslint-config-airbnb-base": undefined,
                        "eslint-config-prettier": undefined,
                        "eslint-plugin-import": undefined,
                        "eslint-plugin-prettier": undefined,
                        "prettier": undefined
                    }
                });
            });
        });
    });
});
