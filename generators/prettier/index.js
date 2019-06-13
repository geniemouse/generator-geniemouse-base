/**
 * Prettier class
 * ==============
 * Extends Base
 * Sub-generator class `yo geniemouse-base:prettier`
 */

const BaseYeomanGenerator = require("../base");

class Prettier extends BaseYeomanGenerator {
    initializing() {
        this.config.set("prettier", true);
        this._welcomeSubGeneratorMessage("Prettier");
    }

    prompting() {
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
        this.fs.copy(this.templatePath("_prettierignore"), this.destinationPath(".prettierignore"));
        if (this.config.get("prettierrc")) {
            this.fs.copy(this.templatePath("_prettierrc.js"), this.destinationPath(".prettierrc.js"));
        }
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
        this._goodbyeMessage("Prettier");
    }
}

module.exports = Prettier;
