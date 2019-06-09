/**
 * ESLint class
 * ============
 * Extends Base
 * Sub-generator class `yo geniemouse-base:eslint`
 */

const BaseYeomanGenerator = require("../base");
const { configArray } = require("../../utils");

class ESLint extends BaseYeomanGenerator {
    initializing() {
        this._welcomeMessage("ESLint", { subgenerator: true });
        this.features = this.options.features || {};
        this.subgen = !this.options.generator;
    }

    prompting() {
        const prompts = configArray(this.subgen, [
            {
                type: "confirm",
                name: "eslint:jest",
                message: "Add ESLint support for Jest?",
                store: true
            },
            {
                type: "confirm",
                name: "eslint:prettier",
                message: "Add ESLint support for Prettier?",
                store: true
            }
        ]);

        return this.prompt(prompts).then((answers) => {
            this.features.jest = answers["eslint:jest"];
            this.features.prettier = answers["eslint:prettier"];
        });
    }

    configuring() {
        this.fs.copy(this.templatePath(".eslintignore"), this.destinationPath(".eslintignore"));
        this.fs.copy(this.templatePath(".eslintrc"), this.destinationPath(".eslintrc"));
    }

    writing() {
        const { jest, prettier } = this.features;

        function eslintrcData() {
            return {
                env: {
                    jest: jest ? true : undefined
                },
                extends: prettier ? ["airbnb-base", "prettier"] : ["airbnb-base"],
                plugins: prettier ? ["prettier"] : []
            };
        }

        function eslintPrettierPackages() {
            if (prettier) {
                return {
                    devDependencies: {
                        "eslint-config-prettier": "^4.3.0",
                        "eslint-plugin-prettier": "^3.1.0"
                    }
                };
            }
            return {};
        }

        this.fs.extendJSON(this.destinationPath(".eslintrc"), eslintrcData());

        // Handle updates to package.json file
        this._mergeJsonTemplate({ input: "_package.json", output: "package.json" });
        this.fs.extendJSON(this.destinationPath("package.json"), eslintPrettierPackages());
        this._sortPackageDependencies();
    }

    install() {
        this._installBase();
    }

    end() {
        if (this.subgen) {
            this._goodbyeMessage("ESLint", { subgenerator: true });
        }
    }
}

module.exports = ESLint;
