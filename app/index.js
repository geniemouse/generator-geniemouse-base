// Import packages
const YeomanGenerator = require("yeoman-generator");
const chalk = require("chalk");
const commandExists = require("command-exists").sync;
const { capitalize } = require("lodash");
const mkdirp = require("mkdirp");
const yosay = require("yosay");

// Config files
const makeESLintConfig = require("../config/eslint");
const makePackage = require("../config/package");
const options = require("../config/options");
const prompts = require("../config/prompts");

// Utils
const { usernamePattern } = require("../utils");

// Generator package.json (for info)
const generatorPackageJson = require("../package.json");

/**
 * Base generator
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

    _createDirectory(dir) {
        return mkdirp(dir, (err) => {
            return this.log(err || `${chalk.green("create directory")} ${dir}`);
        });
    }

    _setFriendlyName(str) {
        return capitalize(str.replace(usernamePattern, "").replace(/-/g, " "));
    }

    _setFeatureFlags(features) {
        return this.featureChoices.reduce((accumulator, feature) => {
            accumulator[feature] = features.includes(feature);
            this.features[feature] = accumulator[feature];
            return accumulator;
        }, {});
    }

    // Step 1: INITIALIZING
    // --------------------
    // Your initialization methods (checking current project state, getting configs, etc)
    initializing() {
        /* istanbul ignore else  */
        if (!this.options["skip-welcome-message"]) {
            this.log(
                yosay(
                    `'Allo 'allo! Out of the box, I include
                    ${chalk.green(".editorconfig")}, ${chalk.green(".gitattributes")}
                    & ${chalk.green(".gitignore")} files. Nice and simple!`
                )
            );
        }

        /**
         * Automatically collect all the code features options;
         * no need to add these manually to the generator code
         * @param  {Array} featuresQuestion
         * @return {Array}
         */
        function getAllFeaturesChoices(featuresQuestion) {
            return featuresQuestion.choices.reduce((accumulator, feature) => {
                accumulator.push(feature.value);
                return accumulator;
            }, []);
        }

        const featuresPrompt = prompts.find((prompt) => prompt.name === "features");
        this.featureChoices = getAllFeaturesChoices(featuresPrompt);
        this.features = {};
        this.directories = [];
        this.data = {};
    }

    // Step 2: PROMPTING
    // -----------------
    // Where you prompt users for options (where you’d call this.prompt())
    // @NOTE: this.prompt() can be called in other places too
    prompting() {
        return this.prompt(prompts).then((answers) => {
            const additionalData = {
                friendlyname: this._setFriendlyName(answers.appname),
                features: this._setFeatureFlags(answers.features),
                // Information:
                // Add details of the Yeoman generator being used.
                // Useful in debugging and generated documentation.
                generator: {
                    date: new Date().toISOString().split("T")[0],
                    name: generatorPackageJson.name,
                    version: generatorPackageJson.version
                }
            };

            this.directories = answers.directories;
            this.data = Object.assign({}, answers, additionalData);
        });
    }

    // Step 3: CONFIGURING
    // -------------------
    // Saving configurations and configure the project
    // (creating .editorconfig files and other metadata files
    configuring() {
        const rootFiles = [".editorconfig", ".gitattributes", ".gitignore", "CHANGELOG.md"];
        rootFiles.forEach((file) => {
            this.fs.copy(this.templatePath(file), this.destinationPath(file));
        });
    }

    // Step 4: DEFAULT
    // ---------------
    // If the method name doesn’t match a priority, it will be pushed to this group.
    // default() {}

    eslintTask() {
        if (this.features.hasESLint) {
            this.fs.copy(this.templatePath(".eslintignore"), this.destinationPath(".eslintignore"));
            this.fs.copyTpl(this.templatePath(".eslintrc"), this.destinationPath(".eslintrc"), this.data);
            this.fs.extendJSON(this.destinationPath(".eslintrc"), makeESLintConfig(this.data));
        }
    }

    prettierTask() {
        if (this.features.hasPrettier) {
            this.fs.copy(this.templatePath(".prettierignore"), this.destinationPath(".prettierignore"));
            /* istanbul ignore else  */
            if (this.data.prettierrc) {
                this.fs.copy(this.templatePath(".prettierrc.js"), this.destinationPath(".prettierrc.js"));
            }
        }
    }

    jestTask() {
        if (this.features.hasJest) {
            this._createDirectory("__tests__");
        }
    }

    directoriesTask() {
        this.directories.forEach((dir) => {
            this._createDirectory(dir);
        });
    }

    // Step 5: WRITING
    // ---------------
    // Where you write the generator specific files (routes, controllers, etc)
    writing() {
        // If this base generator is composed into another, there might be an
        // existing package.json file that we will need to merge with.
        // Store its contents into memory.
        const pkg = this.fs.readJSON(this.destinationPath("package.json"), {});
        this.fs.copyTpl(this.templatePath("_package.json"), this.destinationPath("package.json"), this.data);
        this.fs.copyTpl(this.templatePath("_README.md"), this.destinationPath("README.md"), this.data);
        // Create/Merge package.json with any extra data
        this.fs.extendJSON(this.destinationPath("package.json"), makePackage(this.data));
        this.fs.extendJSON(this.destinationPath("package.json"), pkg);
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
        /* istanbul ignore else  */
        if (!this.options["skip-welcome-message"]) {
            this.log(
                yosay(
                    `${chalk.blue("Finished generating base project files")}
                    See the ${chalk.bold.italic("README.md")} file further details\n`
                )
            );
        }
    }
};
