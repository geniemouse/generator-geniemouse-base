const path = require("path");
const helpers = require("yeoman-test");
const assert = require("yeoman-assert");

const app = "../../app";

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
