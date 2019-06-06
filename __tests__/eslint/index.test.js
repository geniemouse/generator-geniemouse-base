const path = require("path");
const helpers = require("yeoman-test");
const assert = require("yeoman-assert");

const subGen = "../../eslint";
const eslintFiles = [".eslintignore", ".eslintrc"];

describe("ESLint Sub-Generator:", () => {
    describe("Base set-up:", () => {
        beforeAll((done) => {
            helpers
                .run(path.join(__dirname, subGen))
                .withOptions({
                    features: undefined,
                    isBase: undefined
                })
                .on("end", done);
        });

        test("sub-generator can be required without throwing", () => {
            require(subGen);
        });

        test("creates feature files", () => {
            assert.file(eslintFiles);
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

    describe("Alongside Jest:", () => {
        beforeAll((done) => {
            helpers
                .run(path.join(__dirname, subGen))
                .withOptions({
                    features: {
                        hasESLint: true,
                        hasJest: true,
                        hasPrettier: false
                    },
                    isBase: true
                })
                .on("end", done);
        });

        test(".eslintrc file: has expected values", () => {
            assert.jsonFileContent(".eslintrc", {
                env: {
                    jest: true
                }
            });
        });
    });

    describe("Alongside Prettier:", () => {
        beforeAll((done) => {
            helpers
                .run(path.join(__dirname, subGen))
                .withOptions({
                    features: {
                        hasESLint: true,
                        hasJest: false,
                        hasPrettier: true
                    },
                    isBase: true
                })
                .on("end", done);
        });

        test(".eslintrc file: has expected values", () => {
            assert.jsonFileContent(".eslintrc", {
                extends: ["airbnb-base", "prettier"],
                plugins: ["prettier"]
            });
        });

        test("package.json devDependencies have expected packages", () => {
            assert.jsonFileContent("package.json", {
                devDependencies: {
                    "eslint-config-prettier": "^4.3.0",
                    "eslint-plugin-prettier": "^3.1.0"
                }
            });
        });
    });
});
