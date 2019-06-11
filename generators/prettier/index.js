/**
 * Prettier class
 * ==============
 * Extends Base
 * Sub-generator class `yo geniemouse-base:prettier`
 */

const BaseYeomanGenerator = require("../base");

class Prettier extends BaseYeomanGenerator {
    initializing() {
        this._welcomeMessage("Prettier", { subgenerator: true });
        this.subgen = !this.options.generator;
    }

    prompting() {
        if (!this.subgen) {
            return;
        }

        return this.prompt([
            {
                type: "confirm",
                name: "prettierrc",
                message: "Would you like a .prettierrc.js file to be created?",
                suffix: "\n(For overriding bundled Prettier config rules)",
                default: false
            }
        ]).then((answers) => {
            this.config.set("prettierrc", answers.prettierrc);
        });
    }

    configuring() {
        this.fs.copy(this.templatePath(".prettierignore"), this.destinationPath(".prettierignore"));
        if (this.config.get("prettierrc")) {
            this.fs.copy(this.templatePath(".prettierrc.js"), this.destinationPath(".prettierrc.js"));
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
            this._goodbyeMessage("Prettier", { subgenerator: true });
        }
    }
}

module.exports = Prettier;
