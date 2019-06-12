/**
 * ESLint class
 * ============
 * Extends Base
 * Sub-generator class `yo geniemouse-base:eslint`
 */

const BaseYeomanGenerator = require("../base");

class ESLint extends BaseYeomanGenerator {
    initializing() {
        this._setFeature({ eslint: true });
        this._welcomeMessage("ESLint", { subgenerator: true });
        this.subgen = !this.options.generator;
        this.features = {};
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
                default: true
            },
            {
                type: "confirm",
                name: "eslint:prettier",
                message: "Add ESLint support for Prettier?",
                default: true
            }
        ]).then((answers) => {
            // @NOTE: Jest & Prettier flags here are specific to ESLint feature and
            // nothing to do with `this.config.features` settings, so keep them separate
            this.features = {
                jest: answers["eslint:jest"],
                prettier: answers["eslint:prettier"]
            };
        });
    }

    configuring() {
        // @NOTE: `package.json` & `.eslintrc` are handled during the writing phase
        this.fs.copy(this.templatePath(".eslintignore"), this.destinationPath(".eslintignore"));
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
                return {
                    devDependencies: {
                        "eslint-config-prettier": prettier ? "^4.3.0" : undefined,
                        "eslint-plugin-prettier": prettier ? "^3.1.0" : undefined
                    }
                };
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
