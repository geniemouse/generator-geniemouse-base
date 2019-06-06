const path = require("path");
const helpers = require("yeoman-test");
const assert = require("yeoman-assert");

const subGen = "../../jest";
const jestDirectories = ["__tests__"];

describe("Jest:", () => {
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

        test("creates feature files/folders", () => {
            assert.file(jestDirectories);
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
});
