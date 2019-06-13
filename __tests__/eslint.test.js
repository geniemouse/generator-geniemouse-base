const path = require("path");
const helpers = require("yeoman-test");
const assert = require("yeoman-assert");

const subGen = "../generators/eslint";
const eslintFiles = [".eslintignore", ".eslintrc"];

describe("ESLint sub-generator", () => {
    beforeAll((done) => {
        helpers
            .run(path.join(__dirname, subGen))
            .withOptions({
                generator: undefined
            })
            .withPrompts({
                "eslint:jest": false,
                "eslint:prettier": false
            })
            .on("end", done);
    });

    test("can be required without throwing", () => {
        require(subGen);
    });

    test("creates feature files", () => {
        assert.file(eslintFiles);
    });

    test(".eslintrc file has expected values", () => {
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

    test("[package.json] scripts has expected feature commands", () => {
        assert.jsonFileContent("package.json", {
            scripts: {
                lint: "eslint ./"
            }
        });
    });

    test("[package.json] devDependencies has expected feature packages", () => {
        assert.jsonFileContent("package.json", {
            devDependencies: {
                "eslint": "^5.16.0",
                "eslint-config-airbnb-base": "^13.1.0",
                "eslint-plugin-import": "^2.17.3"
            }
        });
    });

    test("[package.json] should not include name, version or description", () => {
        assert.jsonFileContent("package.json", {
            name: undefined,
            description: undefined,
            version: undefined
        });
    });
});

