const path = require("path");
const helpers = require("yeoman-test");
const assert = require("yeoman-assert");

const app = "../../app";

describe("Prettier:", () => {
    describe("On:", () => {
        beforeAll((done) => {
            helpers
                .run(path.join(__dirname, app))
                .withPrompts({
                    features: ["hasPrettier"]
                })
                .on("end", done);
        });

        test("creates feature files", () => {
            assert.file([".prettierignore"]);
        });

        describe("package.json file", () => {
            test("devDependencies has the expected packages", () => {
                assert.jsonFileContent("package.json", {
                    devDependencies: {
                        "@geniemouse/prettier-config": "^1.1.3",
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
                    features: [],
                    hasPrettier: false
                })
                .on("end", done);
        });

        test("does not create feature files", () => {
            assert.noFile([".prettierignore"]);
        });

        describe("package.json file", () => {
            test("devDependencies has the expected packages", () => {
                assert.jsonFileContent("package.json", {
                    devDependencies: {
                        "@geniemouse/prettier-config": undefined,
                        "prettier": undefined
                    }
                });
            });
        });
    });
});
