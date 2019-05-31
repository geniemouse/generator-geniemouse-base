const path = require("path");
const helpers = require("yeoman-test");
const assert = require("yeoman-assert");

const app = "../../app";

describe("Installing ESLint:", () => {
    beforeAll((done) => {
        helpers
            .run(path.join(__dirname, app))
            .withPrompts({ features: ["includeESLint"] })
            .on("end", done);
    });

    test("creates expected files", () => {
        assert.file([".eslintignore", ".eslintrc"]);
        assert.noFile([".prettierignore"]);
    });

    describe(".eslintrc file", () => {
        test("extensions and plugins have their expected values", () => {
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
    });

    describe("package.json file", () => {
        test("scripts has the expected commands", () => {
            assert.jsonFileContent("package.json", {
                scripts: {
                    lint: "eslint ./",
                    test: undefined
                }
            });
        });

        test("devDependencies has the expected packages", () => {
            assert.jsonFileContent("package.json", {
                devDependencies: {
                    "eslint": "^5.16.0",
                    "eslint-config-airbnb-base": "^13.1.0",
                    "eslint-config-prettier": undefined,
                    "eslint-plugin-import": "^2.17.3",
                    "eslint-plugin-prettier": undefined
                }
            });
        });
    });
});
