const path = require("path");
const assert = require("yeoman-assert");
const helpers = require("yeoman-test");

const app = "../generators/app";
const eslintFeature = { files: [".eslintignore", ".eslintrc"], readMeHeading: "### Linting" };
const jestFeature = { files: ["__tests__"], readMeHeading: "### Tests (Jest)" };
const prettierFeature = { files: [".prettierignore", ".prettierrc.js"] };

describe("App generator", () => {
    beforeAll((done) => {
        helpers
            .run(path.join(__dirname, app))
            .withPrompts({
                description: "Lorem ipsum dolor",
                directoriesList: ["one", "two/sub", "three"],
                featuresList: [],
                version: "1.1.1"
            })
            .on("end", done);
    });

    test("can be required without throwing", () => {
        require(app);
    });

    test("creates expected files", () => {
        assert.file([".editorconfig", ".gitattributes", ".gitignore", "package.json", "CHANGELOG.md", "README.md"]);
        assert.noFile([...eslintFeature.files, ...prettierFeature.files, ...jestFeature.files]);
    });

    test("creates expected directories", () => {
        assert.file(["one", "two", "two/sub", "three"]);
    });

    test("package.json file has expected key/values", () => {
        assert.jsonFileContent("package.json", {
            description: "Lorem ipsum dolor",
            version: "1.1.1",
            scripts: {
                lint: undefined,
                test: undefined
            },
            keywords: [],
            author: {},
            engines: {
                node: ">=6.0.0"
            },
            dependencies: {},
            devDependencies: {},
            peerDependencies: {},
            repository: {},
            jest: undefined,
            prettier: undefined
        });
    });

    test("package.json file does not include additional feature information", () => {
        assert.noFileContent([["package.json", "eslint"], ["package.json", "jest"], ["package.json", "prettier"]]);
    });

    test("README file does not include additional feature information", () => {
        assert.noFileContent("README.md", eslintFeature.readMeHeading);
        assert.noFileContent("README.md", jestFeature.readMeHeading);
    });
});

describe("Package.json merge", () => {
    beforeAll((done) => {
        helpers
            .run(path.join(__dirname, app))
            .withPrompts({
                description: "Overwrite package",
                directoriesList: [],
                featuresList: [],
                version: "1.1.2"
            })
            .on("ready", (generator) => {
                // Pre-create a `package.json` file with content that
                // should get overwritten by newer information
                generator.fs.writeJSON("package.json", {
                    description: "Prefab package",
                    version: "0.0.0"
                });
            })
            .on("end", done);
    });

    test("combining with an existsing package.json file merges the contents as expected", () => {
        assert.jsonFileContent("package.json", {
            description: "Overwrite package",
            version: "1.1.2"
        });
    });
});

describe("Add ESLint feature", () => {
    beforeAll((done) => {
        helpers
            .run(path.join(__dirname, app))
            .withOptions({
                "skip-welcome-message": true
            })
            .withPrompts({
                directoriesList: [],
                featuresList: ["eslint"]
            })
            .on("end", done);
    });

    test("package.json file mentions `eslint`", () => {
        assert.fileContent("package.json", "eslint");
    });

    test("README file has ESLint information", () => {
        assert.fileContent("README.md", eslintFeature.readMeHeading);
    });
});

describe("Add Jest feature", () => {
    beforeAll((done) => {
        helpers
            .run(path.join(__dirname, app))
            .withOptions({
                "skip-welcome-message": true
            })
            .withPrompts({
                directoriesList: [],
                featuresList: ["jest"]
            })
            .on("end", done);
    });

    test("package.json file mentions `jest`", () => {
        assert.fileContent("package.json", "jest");
    });

    test("README file has unit-testing information", () => {
        assert.fileContent("README.md", jestFeature.readMeHeading);
    });
});

describe("Add Prettier feature", () => {
    beforeAll((done) => {
        helpers
            .run(path.join(__dirname, app))
            .withOptions({
                "skip-welcome-message": true
            })
            .withPrompts({
                directoriesList: [],
                featuresList: ["prettier"],
                prettierrc: true
            })
            .on("end", done);
    });

    test("package.json file mentions `prettier`", () => {
        assert.fileContent("package.json", "prettier");
    });
});
