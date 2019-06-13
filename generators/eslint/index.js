/**
 * ESLint class
 * ============
 * Extends Base
 * Sub-generator class `yo geniemouse-base:eslint`
 */

const BaseYeomanGenerator = require("../base");

class ESLint extends BaseYeomanGenerator {
    initializing() {
        this.config.set("eslint", true);
        this._welcomeSubGeneratorMessage("ESLint");
    }

    configuring() {
        // @note: `package.json` & `.eslintrc` are handled during the writing phase
        this.fs.copy(this.templatePath(".eslintignore"), this.destinationPath(".eslintignore"));
    }

    writing() {
        const { jest, prettier } = this.config.getAll();

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
        this._goodbyeMessage("ESLint");
    }
}

module.exports = ESLint;
