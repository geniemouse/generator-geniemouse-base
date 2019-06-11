/**
 * ESLint class
 * ============
 * Extends Base
 * Sub-generator class `yo geniemouse-base:eslint`
 */

const BaseYeomanGenerator = require("../base");

class ESLint extends BaseYeomanGenerator {
    initializing() {
        this._welcomeMessage("ESLint", { subgenerator: true });
        this.features = this.options.features || {};
        this.subgen = !this.options.generator;
    }

    prompting() {
        if (!this.subgen) {
            return;
        }

        return this.prompt([
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
        ]).then((answers) => {
            this.features.jest = answers["eslint:jest"];
            this.features.prettier = answers["eslint:prettier"];
        });
    }

    configuring() {
        this.fs.copy(this.templatePath(".eslintignore"), this.destinationPath(".eslintignore"));
        // @NOTE: `package.json` & `.eslintrc` are handled during the writing phase
    }

    writing() {
        const { jest, prettier } = this.features;

        this._handleJsonFile({
            input: ".eslintrc",
            output: ".eslintrc",
            data: (function eslintrcData() {
                return {
                    env: {
                        jest: jest ? true : undefined
                    },
                    extends: prettier ? ["airbnb-base", "prettier"] : ["airbnb-base"],
                    plugins: prettier ? ["prettier"] : []
                };
            })()
        });

        this._handleJsonFile({
            input: "_package.json",
            output: "package.json",
            data: (function eslintPrettierPackages() {
                if (prettier) {
                    return {
                        devDependencies: {
                            "eslint-config-prettier": "^4.3.0",
                            "eslint-plugin-prettier": "^3.1.0"
                        }
                    };
                }
                return {};
            })()
        });
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
