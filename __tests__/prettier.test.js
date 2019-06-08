const path = require("path");
const helpers = require("yeoman-test");
const assert = require("yeoman-assert");

const subGen = "../generators/prettier";

describe("Prettier sub-generator", () => {
    beforeAll((done) => {
        helpers
            .run(path.join(__dirname, subGen))
            .withOptions({
                features: undefined,
                generator: undefined
            })
            .withPrompts({
                "prettier:prettierrc": false
            })
            .on("end", done);
    });

    test("can be required without throwing", () => {
        require(subGen);
    });

    test("creates expected files", () => {
        assert.file([".prettierignore"]);
        assert.noFile([".prettierrc.js"]);
    });

    test("[package.json] devDependencies has expected feature packages", () => {
        assert.jsonFileContent("package.json", {
            devDependencies: {
                "@geniemouse/prettier-config": "^1.1.3",
                "prettier": "^1.17.1"
            }
        });
    });

    describe("Other answers", () => {
        beforeAll((done) => {
            helpers
                .run(path.join(__dirname, subGen))
                .withOptions({
                    features: undefined,
                    generator: undefined
                })
                .withPrompts({
                    "prettier:prettierrc": true
                })
                .on("end", done);
        });

        test(".prettierrc.js file requested successfully", () => {
            assert.file([".prettierrc.js"]);
        });
    });
});
