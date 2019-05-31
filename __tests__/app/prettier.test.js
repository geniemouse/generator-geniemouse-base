const path = require("path");
const helpers = require("yeoman-test");
const assert = require("yeoman-assert");

const app = "../../app";

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
