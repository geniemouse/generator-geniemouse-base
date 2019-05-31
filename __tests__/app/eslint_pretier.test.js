const path = require("path");
const helpers = require("yeoman-test");
const assert = require("yeoman-assert");

const app = "../../app";

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
