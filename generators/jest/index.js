// Import packages
// ...
/**
 * Jest class
 * ==========
 * Extends Base
 * Sub-generator class `yo geniemouse-base:jest`
 */

const BaseGenerator = require("../base");

class Jest extends BaseGenerator {
    initializing() {
        this.welcomeMessage("Jest", { subgenerator: true });
        this.subgen = !this.options.generator;
    }

    configuring() {
        this.createDirectory("__tests__");
    }

    writing() {
        // Handle updates to package.json file
        this.mergeJsonTemplate({ input: "_package.json", output: "package.json" });
        this.sortPackageDependencies();
    }

    install() {
        this.installBase();
    }

    end() {
        if (this.subgen) {
            this.goodbyeMessage("Jest", { subgenerator: true });
        }
    }
}

module.exports = Jest;
