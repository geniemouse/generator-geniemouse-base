// Import packages
// ...

// Config files
const BaseGenerator = require("../base");

/**
 * Jest sub-generator
 */
module.exports = class extends BaseGenerator {
    initializing() {
        this.welcomeMessage("Jest", { subgenerator: true });
    }

    configuring() {
        this.createDirectory("__tests__");
    }

    writing() {
        // Handle updates to package.json file
        this.mergeJsonTemplate({ input: "_package.json", output: "package.json" });
    }

    install() {
        this.installBase();
    }

    end() {
        if (!this.options.isBase) {
            this.goodbyeMessage("Jest", { subgenerator: true });
        }
    }
};
