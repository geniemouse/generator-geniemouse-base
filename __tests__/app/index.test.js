const path = require("path");
const helpers = require("yeoman-test");
const assert = require("yeoman-assert");

const app = "../../app";

describe("Base Generator:", () => {
    beforeAll((done) => {
        helpers
            .run(path.join(__dirname, app))
            .withPrompts({ description: "Lorem ipsum dolor", features: [], version: "1.1.1" })
            .on("end", done);
    });

    test("generator can be required without throwing", () => {
        require(app);
    });

    describe("file creation", () => {
        test("creates expected files", () => {
            assert.file([".editorconfig", ".gitattributes", ".gitignore", "package.json", "README.md"]);
        });

        test("does not create feature-dependent files", () => {
            assert.noFile([".eslintignore", ".eslintrc", ".prettierignore"]);
        });
    });

    describe("package.json file", () => {
        test("creates expected key/values", () => {
            assert.jsonFileContent("package.json", {
                appname: undefined,
                description: "Lorem ipsum dolor",
                version: "1.1.1",
                scripts: {},
                keywords: [],
                author: {},
                engines: {
                    node: ">=6.0.0"
                },
                dependencies: {},
                devDependencies: {},
                peerDependencies: {},
                repository: {}
            });
        });

        test("does not create feature-dependent key/values", () => {
            assert.noJsonFileContent("package.json", {
                jest: {},
                prettier: ""
            });
        });
    });
});

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

describe("Installing Prettier:", () => {
    beforeAll((done) => {
        helpers
            .run(path.join(__dirname, app))
            .withPrompts({ features: ["includePrettier"] })
            .on("end", done);
    });

    test("creates expected files", () => {
        assert.file([".prettierignore"]);
        assert.noFile([".eslintignore", ".eslintrc"]);
    });

    describe("package.json file", () => {
        test("scripts has the expected commands", () => {
            assert.jsonFileContent("package.json", {
                scripts: {
                    lint: undefined,
                    test: undefined
                }
            });
        });

        test("devDependencies has the expected packages", () => {
            assert.jsonFileContent("package.json", {
                devDependencies: {
                    "@geniemouse/prettier-config": "^1.1.3",
                    "eslint-config-prettier": undefined,
                    "eslint-plugin-prettier": undefined,
                    "prettier": "^1.17.1"
                }
            });
        });
    });
});

describe("Installing Jest:", () => {
    beforeAll((done) => {
        helpers
            .run(path.join(__dirname, app))
            .withPrompts({ features: ["includeJest"] })
            .on("end", done);
    });

    test("creates expected files", () => {
        assert.noFile([".eslintignore", ".eslintrc", ".prettierignore"]);
    });

    describe("package.json file", () => {
        test("scripts has the expected commands", () => {
            assert.jsonFileContent("package.json", {
                scripts: {
                    "lint": undefined,
                    "test": "jest ./",
                    "test:coverage": "jest ./ --coverage",
                    "test:watch": "jest ./ --watchAll"
                }
            });
        });

        test("devDependencies has the expected packages", () => {
            assert.jsonFileContent("package.json", {
                devDependencies: {
                    jest: "^24.8.0"
                }
            });
        });
    });
});

describe("Installing ESLint & Prettier:", () => {
    beforeAll((done) => {
        helpers
            .run(path.join(__dirname, app))
            .withPrompts({ features: ["includeESLint", "includePrettier"] })
            .on("end", done);
    });

    test("creates expected files", () => {
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
