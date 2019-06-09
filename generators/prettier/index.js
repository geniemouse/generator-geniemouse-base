/**
 * Prettier class
 * ==============
 * Extends Base
 * Sub-generator class `yo geniemouse-base:prettier`
 */

const BaseYeomanGenerator = require("../base");
const { configArray } = require("../../utils");

class Prettier extends BaseYeomanGenerator {
    initializing() {
        this._welcomeMessage("Prettier", { subgenerator: true });
        this.prettierrc = this.options.prettierrc;
        this.subgen = !this.options.generator;
    }

    prompting() {
        const prompts = configArray(this.subgen, [
            {
                type: "confirm",
                name: "prettier:prettierrc",
                message: "Would you like a .prettierrc.js file to be created?",
                suffix: "\n(For overriding bundled Prettier config rules)",
                store: true
            }
        ]);

        return this.prompt(prompts).then((answers) => {
            this.prettierrc = answers["prettier:prettierrc"];
        });
    }

    configuring() {
        this.fs.copy(this.templatePath(".prettierignore"), this.destinationPath(".prettierignore"));
        if (this.prettierrc) {
            this.fs.copy(this.templatePath(".prettierrc.js"), this.destinationPath(".prettierrc.js"));
        }
    }

    writing() {
        // Handle updates to package.json file
        this._mergeJsonTemplate({ input: "_package.json", output: "package.json" });
        this._sortPackageDependencies();
    }

    install() {
        this._installBase();
    }

    end() {
        if (this.subgen) {
            this._goodbyeMessage("Prettier", { subgenerator: true });
        }
    }
}

module.exports = Prettier;
