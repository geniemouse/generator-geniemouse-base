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
                    directories: [],
                    features: ["hasPrettier"],
                    prettierrc: true
                })
                .on("end", done);
        });

        test("creates feature files", () => {
            assert.file([".prettierrc.js", ".prettierignore"]);
        });

        test("package.json file mentions prettier", () => {
            assert.fileContent("package.json", "prettier");
        });
    });

    describe("Off:", () => {
        beforeAll((done) => {
            helpers
                .run(path.join(__dirname, app))
                .withPrompts({
                    directories: [],
                    features: [],
                    hasPrettier: false
                })
                .on("end", done);
        });

        test("does not create feature files", () => {
            assert.noFile([".prettierrc.js", ".prettierignore"]);
        });

        test("package.json file does not mention prettier", () => {
            assert.noFileContent("package.json", "prettier");
        });
    });
});
