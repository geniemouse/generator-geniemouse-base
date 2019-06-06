// Import packages
const YeomanGenerator = require("yeoman-generator");
const chalk = require("chalk");
const commandExists = require("command-exists").sync;
const yosay = require("yosay");

// Config files
const options = require("../config/options");

// Utils
const { createDirectory, mergeJSON } = require("../utils");

/**
 * Prettier sub-generator
 */
module.exports = class extends YeomanGenerator {
    constructor(args, opts) {
        // Don't replace Generator's parameters ;)
        super(args, opts);

        // Generator running with current options flags...
        Object.keys(options).map((optionName) => {
            return this.option(optionName, options[optionName]);
        });
    }

    // Step 1: INITIALIZING
    // --------------------
    // Your initialization methods (checking current project state, getting configs, etc)
    initializing() {
        /* istanbul ignore else  */
        if (!this.options.isBase) {
            this.log(yosay(`${chalk.blue("Installing Prettier to this project location")}`));
        }

        this.prettierrc = this.options.prettierrc;
    }

    // Step 2: PROMPTING
    // -----------------
    // Where you prompt users for options (where you’d call this.prompt())
    // @NOTE: this.prompt() can be called in other places too
    prompting() {
        /* istanbul ignore else  */
        if (!this.options.isBase) {
            return this.prompt([
                {
                    type: "confirm",
                    name: "prettier:prettierrc",
                    message: "Would you like a .prettierrc.js file to be created?",
                    suffix: " (For overriding bundled Prettier config rules)",
                    store: true
                }
            ]).then((answers) => {
                this.prettierrc = answers["prettier:prettierrc"];
            });
        }
    }

    // Step 3: CONFIGURING
    // -------------------
    // Saving configurations and configure the project
    // (creating .editorconfig files and other metadata files
    configuring() {
        this.fs.copy(this.templatePath(".prettierignore"), this.destinationPath(".prettierignore"));
        /* istanbul ignore else */
        if (this.prettierrc) {
            this.fs.copy(this.templatePath(".prettierrc.js"), this.destinationPath(".prettierrc.js"));
        }
    }

    // Step 4: DEFAULT
    // ---------------
    // If the method name doesn’t match a priority, it will be pushed to this group.
    // default() {}

    // Step 5: WRITING
    // ---------------
    // Where you write the generator specific files (routes, controllers, etc)
    writing() {
        // Updates package.json file
        mergeJSON.call(this, { input: "_package.json", output: "package.json" });
    }

    // Step 6: CONFLICTS
    // -----------------
    // Where conflicts are handled (used internally)
    // conflicts() {}

    // Step 7: INSTALL
    // ---------------
    // Where installations are run (npm, yarn, bower)
    // No matter how many generators are linked, or how many install calls in methods,
    // Yeoman collects & calls install once
    install() {
        const hasYarn = commandExists("yarn");
        /* istanbul ignore else  */
        if (!this.options.isBase) {
            this.installDependencies({
                npm: !hasYarn,
                yarn: hasYarn,
                bower: false,
                skipMessage: this.options["skip-install-message"],
                skipInstall: this.options["skip-install"]
            });
        }
    }

    // Step 8: END
    // -----------
    // Called last, cleanup, say good bye, etc
    end() {
        /* istanbul ignore else  */
        if (!this.options.isBase) {
            this.log(`${chalk.blue("Finished installing Prettier")}`);
        }
    }
};
