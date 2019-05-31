const path = require("path");
const helpers = require("yeoman-test");
const assert = require("yeoman-assert");

const app = "../../app";

describe("Jest:", () => {
    describe("On:", () => {
        beforeAll((done) => {
            helpers
                .run(path.join(__dirname, app))
                .withPrompts({
                    features: ["includeJest"]
                })
                .on("end", done);
        });

        test("creates feature files/folders", () => {
            assert.file(["__tests__"]);
        });

        describe("package.json file", () => {
            test("scripts has the expected commands", () => {
                assert.jsonFileContent("package.json", {
                    scripts: {
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

    describe("Off:", () => {
        beforeAll((done) => {
            helpers
                .run(path.join(__dirname, app))
                .withPrompts({
                    features: [],
                    includeJest: false
                })
                .on("end", done);
        });

        test("does not create feature files/folders", () => {
            assert.noFile(["__tests__"]);
        });

        describe("package.json file", () => {
            test("scripts has the expected commands", () => {
                assert.jsonFileContent("package.json", {
                    scripts: {
                        "test": undefined,
                        "test:coverage": undefined,
                        "test:watch": undefined
                    }
                });
            });

            test("devDependencies has the expected packages", () => {
                assert.jsonFileContent("package.json", {
                    devDependencies: {
                        jest: undefined
                    }
                });
            });
        });
    });
});