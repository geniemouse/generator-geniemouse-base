const path = require("path");
const helpers = require("yeoman-test");
const assert = require("yeoman-assert");

const subGen = "../../prettier";

describe("Prettier:", () => {
    describe("Base set-up:", () => {
        beforeAll((done) => {
            helpers
                .run(path.join(__dirname, subGen))
                .withOptions({
                    features: undefined,
                    isBase: undefined
                })
                .withPrompts({
                    "prettier:prettierrc": false
                })
                .on("end", done);
        });

        test("sub-generator can be required without throwing", () => {
            require(subGen);
        });

        test("creates expected files", () => {
            assert.file([".prettierignore"]);
            assert.noFile([".prettierrc.js"]);
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

    describe("Alternative Prompt Answers:", () => {
        beforeAll((done) => {
            helpers
                .run(path.join(__dirname, subGen))
                .withOptions({
                    features: undefined,
                    isBase: undefined
                })
                .withPrompts({
                    "prettier:prettierrc": true
                })
                .on("end", done);
        });

        test(".prettierrc.js file requested", () => {
            assert.file([".prettierrc.js"]);
        });
    });
});
