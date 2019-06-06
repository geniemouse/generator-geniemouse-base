const path = require("path");
const helpers = require("yeoman-test");
const assert = require("yeoman-assert");

const app = "../../app";
const eslintFiles = [".eslintignore", ".eslintrc"];
const readMeHeading = "### Linting";

describe("ESLint Feature:", () => {
    describe("On:", () => {
        beforeAll((done) => {
            helpers
                .run(path.join(__dirname, app))
                .withPrompts({
                    directories: [],
                    features: ["hasESLint"]
                })
                .on("end", done);
        });

        test("README file has ESLint information", () => {
            assert.fileContent("README.md", readMeHeading);
        });

        test("package.json file mentions eslint", () => {
            assert.fileContent("package.json", "eslint");
        });
    });

    describe("Off:", () => {
        beforeAll((done) => {
            helpers
                .run(path.join(__dirname, app))
                .withPrompts({
                    directories: [],
                    features: [],
                    hasESLint: false
                })
                .on("end", done);
        });

        test("does not create feature files", () => {
            assert.noFile(eslintFiles);
        });

        test("README file does not include ESLint information", () => {
            assert.noFileContent("README.md", readMeHeading);
        });

        test("package.json file does not mention eslint", () => {
            assert.noFileContent("package.json", "eslint");
        });
    });
});
