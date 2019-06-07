// Import packages
// ...

// Config files
const BaseGenerator = require("../base");

/**
 * Prettier sub-generator
 */
module.exports = class extends BaseGenerator {
    initializing() {
        this.welcomeMessage("Prettier", { subgenerator: true });
        this.prettierrc = this.options.prettierrc;
    }

    prompting() {
        /* istanbul ignore else  */
        if (!this.options.isBase) {
            return this.prompt([
                {
                    type: "confirm",
                    name: "prettier:prettierrc",
                    message: "Would you like a .prettierrc.js file to be created?",
                    suffix: "\n(For overriding bundled Prettier config rules)",
                    store: true
                }
            ]).then((answers) => {
                this.prettierrc = answers["prettier:prettierrc"];
            });
        }
    }

    configuring() {
        this.fs.copy(this.templatePath(".prettierignore"), this.destinationPath(".prettierignore"));
        if (this.prettierrc) {
            this.fs.copy(this.templatePath(".prettierrc.js"), this.destinationPath(".prettierrc.js"));
        }
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
            this.goodbyeMessage("Prettier", { subgenerator: true });
        }
    }
};
