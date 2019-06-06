// Import packages
const YeomanGenerator = require("yeoman-generator");
const chalk = require("chalk");
const commandExists = require("command-exists").sync;

// Config files
const options = require("../config/options");

/**
 * ESLint sub-generator
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
        this.log(`${chalk.blue("Installing eslint")}`);
    }

    // Step 2: PROMPTING
    // -----------------
    // Where you prompt users for options (where you’d call this.prompt())
    // @NOTE: this.prompt() can be called in other places too
    // prompting() {}

    // Step 3: CONFIGURING
    // -------------------
    // Saving configurations and configure the project
    // (creating .editorconfig files and other metadata files
    configuring() {
        this.fs.copy(this.templatePath(".eslintignore"), this.destinationPath(".eslintignore"));
        this.fs.copy(this.templatePath(".eslintrc"), this.destinationPath(".eslintrc"));
        this.fs.copy(this.templatePath("_package.json"), this.destinationPath("package.json"));
    }

    // Step 4: DEFAULT
    // ---------------
    // If the method name doesn’t match a priority, it will be pushed to this group.
    // default() {}

    // Step 5: WRITING
    // ---------------
    // Where you write the generator specific files (routes, controllers, etc)
    writing() {
        this.log(`${chalk.green("writing eslint settings into package.json")}`);
        this.fs.extendJSON(this.destinationPath("package.json"), {});
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
        this.installDependencies({
            npm: !hasYarn,
            yarn: hasYarn,
            bower: false,
            skipMessage: this.options["skip-install-message"],
            skipInstall: this.options["skip-install"]
        });
    }

    // Step 8: END
    // -----------
    // Called last, cleanup, say good bye, etc
    end() {
        this.log(`${chalk.blue("Finished installing eslint")}`);
    }
};
