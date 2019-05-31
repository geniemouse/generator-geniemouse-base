const path = require("path");
const helpers = require("yeoman-test");
const assert = require("yeoman-assert");

const app = "../../app";

describe("Base Generator (no features):", () => {
    beforeAll((done) => {
        helpers
            .run(path.join(__dirname, app))
            .withPrompts({
                description: "Lorem ipsum dolor",
                features: [],
                version: "1.1.1"
            })
            .on("end", done);
    });

    test("generator can be required without throwing", () => {
        require(app);
    });

    test("creates expected files", () => {
        assert.file([".editorconfig", ".gitattributes", ".gitignore", "package.json", "README.md"]);
        assert.noFile([".eslintignore", ".eslintrc", ".prettierignore"]);
    });

    test("package.json file has expected key/values", () => {
        assert.jsonFileContent("package.json", {
            appname: undefined,
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
});
