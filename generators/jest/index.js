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
        this._setFeature({ jest: true });
        this._welcomeMessage("Jest", { subgenerator: true });
        this.subgen = !this.options.generator;
    }

    configuring() {
        this._createDirectory("__tests__");
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
