const path = require("path");
const helpers = require("yeoman-test");
const assert = require("yeoman-assert");

const subGen = "../generators/prettier";

describe("Prettier sub-generator", () => {
    beforeAll((done) => {
        helpers
            .run(path.join(__dirname, subGen))
            .withOptions({
                generator: undefined
            })
            .withPrompts({
                prettierrc: false
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

    test("[package.json] should not include name, version or description", () => {
        assert.jsonFileContent("package.json", {
            name: undefined,
            description: undefined,
            version: undefined
        });
    });

    describe("Other answers", () => {
        beforeAll((done) => {
            helpers
                .run(path.join(__dirname, subGen))
                .withOptions({
                    generator: undefined
                })
                .withPrompts({
                    prettierrc: true
                })
                .on("end", done);
        });

        test(".prettierrc.js file requested successfully", () => {
            assert.file([".prettierrc.js"]);
        });
    });
});

describe("ESLint > Prettier: ESLint settings updated", () => {
    beforeAll((done) => {
        helpers
            .run(path.join(__dirname, subGen))
            .withLocalConfig({
                testingNote: "localConfig (equiv: this.config.defaults)",
                eslint: true,
                prettier: true
            })
            .withOptions({
                "generator": undefined,
                "skip-message": true
            })
            .on("end", done);
    });

    test(".eslintrc file has expected Prettier values", () => {
        assert.jsonFileContent(".eslintrc", {
            extends: ["airbnb-base", "prettier"],
            plugins: ["prettier"]
        });
    });

    test("[package.json] devDependencies include `eslint-*-prettier` packages", () => {
        assert.jsonFileContent("package.json", {
            devDependencies: {
                "eslint-config-prettier": "^4.3.0",
                "eslint-plugin-prettier": "^3.1.0"
            }
        });
    });
});
