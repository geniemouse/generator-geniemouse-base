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
                default: true
            },
            {
                type: "confirm",
                name: "eslint:prettier",
                message: "Add ESLint support for Prettier?",
                default: true
            }
        ]).then((answers) => {
            this.config.set("features", {
                eslint: true,
                jest: answers["eslint:jest"],
                prettier: answers["eslint:prettier"]
            });
        });
    }

    configuring() {
        this.fs.copy(this.templatePath(".eslintignore"), this.destinationPath(".eslintignore"));
        // @NOTE: `package.json` & `.eslintrc` are handled during the writing phase
    }

    writing() {
        const { jest, prettier } = this.config.get("features");

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
