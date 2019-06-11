const path = require("path");
const helpers = require("yeoman-test");
const assert = require("yeoman-assert");

const subGen = "../generators/jest";
const jestDirectories = ["__tests__"];

describe("Jest sub-generator", () => {
    beforeAll((done) => {
        helpers
            .run(path.join(__dirname, subGen))
            .withOptions({
                generator: undefined
            })
            .on("end", done);
    });

    test("can be required without throwing", () => {
        require(subGen);
    });

    test("creates feature files & folders", () => {
        assert.file(jestDirectories);
    });

    test("[package.json] devDependencies has expected feature packages", () => {
        assert.jsonFileContent("package.json", {
            devDependencies: {
                jest: "^24.8.0"
            }
        });
    });

    test("[package.json] scripts has expected feature commands", () => {
        assert.jsonFileContent("package.json", {
            scripts: {
                "test": "jest ./",
                "test:coverage": "jest ./ --coverage",
                "test:watch": "jest ./ --watchAll"
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
