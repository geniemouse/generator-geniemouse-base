/**
 * ESLint class
 * ============
 * Extends Base
 * Sub-generator class `yo geniemouse-base:eslint`
 */

const BaseGenerator = require("../base");

class ESLint extends BaseGenerator {
    initializing() {
        this.welcomeMessage("ESLint", { subgenerator: true });
        this.features = this.options.features || {};
    }

    prompting() {
        if (!this.options.isBase) {
            return this.prompt([
                {
                    type: "confirm",
                    name: "eslint:hasJest",
                    message: "Add ESLint support for Jest?",
                    store: true
                },
                {
                    type: "confirm",
                    name: "eslint:hasPrettier",
                    message: "Add ESLint support for Prettier?",
                    store: true
                }
            ]).then((answers) => {
                this.features.hasJest = answers["eslint:hasJest"];
                this.features.hasPrettier = answers["eslint:hasPrettier"];
            });
        }
    }

    configuring() {
        this.fs.copy(this.templatePath(".eslintignore"), this.destinationPath(".eslintignore"));
        this.fs.copy(this.templatePath(".eslintrc"), this.destinationPath(".eslintrc"));
    }

    writing() {
        const { hasJest, hasPrettier } = this.features;

        function eslintrcData() {
            return {
                env: {
                    jest: hasJest ? true : undefined
                },
                extends: hasPrettier ? ["airbnb-base", "prettier"] : ["airbnb-base"],
                plugins: hasPrettier ? ["prettier"] : []
            };
        }

        function eslintPrettierPackages() {
            if (hasPrettier) {
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
        this.mergeJsonTemplate({ input: "_package.json", output: "package.json" });
        this.fs.extendJSON(this.destinationPath("package.json"), eslintPrettierPackages());
        this.sortPackageDependencies();
    }

    install() {
        this.installBase();
    }

    end() {
        if (!this.options.isBase) {
            this.goodbyeMessage("ESLint", { subgenerator: true });
        }
    }
}

module.exports = ESLint;
