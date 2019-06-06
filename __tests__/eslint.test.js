const path = require("path");
const helpers = require("yeoman-test");
const assert = require("yeoman-assert");

const app = "../app";
const eslintFiles = [".eslintignore", ".eslintrc"];
const readMeHeading = "### Linting";

describe("ESLint:", () => {
    describe("On:", () => {
        beforeAll((done) => {
            helpers
                .run(path.join(__dirname, app))
                .withPrompts({
                    directories: [],
                    features: ["hasESLint"]
                })
                .on("end", done);
        });

        test("creates feature files", () => {
            assert.file(eslintFiles);
        });

        test("README file has ESLint information", () => {
            assert.fileContent("README.md", readMeHeading);
        });

        test(".eslintrc file: extensions/plugins have expected values", () => {
            assert.jsonFileContent(".eslintrc", {
                env: {
                    jest: undefined
                },
                extends: ["airbnb-base"],
                plugins: [],
                rules: {
                    "import/extensions": {
                        js: "always",
                        json: "always"
                    }
                }
            });
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
                        "eslint": "^5.16.0",
                        "eslint-config-airbnb-base": "^13.1.0",
                        "eslint-plugin-import": "^2.17.3"
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
                    hasESLint: false
                })
                .on("end", done);
        });

        test("does not create feature files", () => {
            assert.noFile(eslintFiles);
        });

        test("README file does not include ESLint information", () => {
            assert.noFileContent("README.md", readMeHeading);
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
                        "eslint": undefined,
                        "eslint-config-airbnb-base": undefined,
                        "eslint-plugin-import": undefined
                    }
                });
            });
        });
    });
});
