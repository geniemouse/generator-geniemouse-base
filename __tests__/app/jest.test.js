const path = require("path");
const helpers = require("yeoman-test");
const assert = require("yeoman-assert");

const app = "../../app";
const jestDirectories = ["__tests__"];
const readMeHeading = "### Tests (Jest)";

describe("Jest Feature:", () => {
    describe("On:", () => {
        beforeAll((done) => {
            helpers
                .run(path.join(__dirname, app))
                .withPrompts({
                    directories: [],
                    features: ["hasJest"]
                })
                .on("end", done);
        });

        test("README file has unit-testing information", () => {
            assert.fileContent("README.md", readMeHeading);
        });

        test("package.json file mentions jest", () => {
            assert.fileContent("package.json", "jest");
        });
    });

    describe("Off:", () => {
        beforeAll((done) => {
            helpers
                .run(path.join(__dirname, app))
                .withPrompts({
                    directories: [],
                    features: [],
                    hasJest: false
                })
                .on("end", done);
        });

        test("does not create feature files/folders", () => {
            assert.noFile(jestDirectories);
        });

        test("README file does not include unit-testing information", () => {
            assert.noFileContent("README.md", readMeHeading);
        });

        test("package.json file does not mention jest", () => {
            assert.noFileContent("package.json", "jest");
        });
    });
});
