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
        this._welcomeSubGeneratorMessage("Jest");
        this.subgen = !this.options.generator;
    }

    configuring() {
        this._createDirectory("__tests__");
    }

    updateESLintConfiguration() {
        if (this.config.get("eslint")) {
            this.composeWith(require.resolve(`../eslint`), {
                "skip-message": true
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
        this._goodbyeMessage("Jest");
    }
}

module.exports = Jest;
