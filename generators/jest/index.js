// Import packages
// ...
/**
 * Jest class
 * ==========
 * Extends Base
 * Sub-generator class `yo geniemouse-base:jest`
 */

const BaseYeomanGenerator = require("../base");

class Jest extends BaseYeomanGenerator {
    initializing() {
        this.config.set("jest", true);
        this._welcomeMessage("Jest", { subgenerator: true });
        this.subgen = !this.options.generator;
    }

    configuring() {
        this._createDirectory("__tests__");
    }

    updateESLintConfiguration() {
        if (this.config.get("eslint")) {
            this.composeWith(require.resolve(`../eslint`), {
                "skip-messages": true
            });
        }
    }

    writing() {
        this._handleJsonFile({ input: "_package.json", output: "package.json" });
    }

    install() {
        this._installBase();
    }

    end() {
        if (this.subgen) {
            this._goodbyeMessage("Jest", { subgenerator: true });
        }
    }
}

module.exports = Jest;
