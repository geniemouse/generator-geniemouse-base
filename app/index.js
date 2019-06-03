// Import packages
const YeomanGenerator = require("yeoman-generator");
const chalk = require("chalk");
const commandExists = require("command-exists").sync;
const { capitalize } = require("lodash");
const mkdirp = require("mkdirp");
const yosay = require("yosay");

// Import local files
const { usernamePattern } = require("../utils");
const files = require("../config/files");
const makeESLintConfig = require("../config/eslint");
const makePackage = require("../config/package");
const options = require("../config/options");
const prompts = require("../config/prompts");

// The generator package.json
const generatorPackageJson = require("../package.json");

/**
 * Base generator
 */
module.exports = class extends YeomanGenerator {
    constructor(args, opts) {
        // Don't replace Generator's parameters ;)
        super(args, opts);

        // Collect all config/options flags
        Object.keys(options).map((optionName) => {
            return this.option(optionName, options[optionName]);
        });

        function getAllFeaturesChoices(featuresQuestion) {
            return featuresQuestion.choices.reduce((accumulator, feature) => {
                accumulator.push(feature.value);
                return accumulator;
            }, []);
        }

        // Collect all the possible features choices & store them
        const featuresPrompt = prompts.find((prompt) => prompt.name === "features");
        this.featureChoices = getAllFeaturesChoices(featuresPrompt);
        this.features = {};
    }

    _copy(input, output) {
        return this.fs.copy(this.templatePath(input), this.destinationPath(output));
    }

    _copyTemplate(input, output, data) {
        return this.fs.copyTpl(this.templatePath(input), this.destinationPath(output), data);
    }

    _setFriendlyName(str) {
        return capitalize(str.replace(usernamePattern, "").replace(/-/g, " "));
    }

    _setFeatureFlags(features) {
        return this.featureChoices.reduce((accumulator, feature) => {
            accumulator[feature] = features.includes(feature);
            this.features[feature] = accumulator[feature];
            return accumulator;
        }, {})
    }

    // Asking the set-up questions
    prompting() {
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

            this.data = Object.assign({}, answers, additionalData);
        });
    }

    // Directories & files; including parsing data into them
    writing() {
        // Root files (straight copying task)
        files.root.forEach((file) => {
            this._copy.call(this, file, file);
        });

        // Copy files from one location to another
        files.toCopy.forEach((file) => {
            this._copy.call(this, file.input, file.output);
        });

        // Files to parse before copying over
        files.toParse.forEach((file) => {
            this._copyTemplate.call(this, file.input, file.output, this.data);
        });

        this.fs.extendJSON(this.destinationPath("package.json"), makePackage(this.data));
    }

    eslintTask() {
        if (this.features.includeESLint) {
            this._copy.call(this, ".eslintignore", ".eslintignore");
            this._copyTemplate.call(this, ".eslintrc", ".eslintrc", this.data);
            this.fs.extendJSON(this.destinationPath(".eslintrc"), makeESLintConfig(this.data));
        }
    }

    prettierTask() {
        if (this.features.includePrettier) {
            this._copy.call(this, ".prettierignore", ".prettierignore");
        }
    }

    jestTask() {
        if (this.features.includeJest) {
            mkdirp("__tests__");
        }
    }

    // Run the package install
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

    // Tidy-up
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
