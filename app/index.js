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

        // Collect all the possible features choices & store them
        const featuresPrompt = prompts.find((prompt) => prompt.name === "features");
        this.featureChoices = featuresPrompt.choices.reduce((accumulator, feature) => {
            accumulator.push(feature.value);
            return accumulator;
        }, []);

        this.features = {};
    }


    _getTemplateData(data) {
        return Object.assign(
            data,
            // Information only:
            // could be useful in debugging or in README template
            {
                generator: {
                    date: new Date().toISOString().split("T")[0],
                    name: generatorPackageJson.name,
                    version: generatorPackageJson.version
                }
            }
        );
    }

    _copy(input, output) {
        return this.fs.copy(this.templatePath(input), this.destinationPath(output));
    }

    _copyTemplate(input, output, data) {
        return this.fs.copyTpl(this.templatePath(input), this.destinationPath(output), data);
    }

    // Generator steps
    initializing() {
        // Init step
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
                friendlyname: (() => {
                    return capitalize(answers.appname.replace(usernamePattern, "").replace(/-/g, " "));
                })(),
                features: this.featureChoices.reduce((accumulator, feature) => {
                    accumulator[feature] = this.features[feature] = answers.features.includes(feature);
                    return accumulator;
                }, {})
            };

            this.answers = Object.assign({}, answers, additionalData);
            this.templateData = this._getTemplateData(this.answers);
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
            this._copyTemplate.call(this, file.input, file.output, this.templateData);
        });

        this.fs.extendJSON(this.destinationPath("package.json"), makePackage(this.templateData));
    }

    eslintTask() {
        if (this.features.includeESLint) {
            this._copy.call(this, ".eslintignore", ".eslintignore");
            this._copyTemplate.call(this, ".eslintrc", ".eslintrc", this.templateData);
            this.fs.extendJSON(this.destinationPath(".eslintrc"), makeESLintConfig(this.templateData));
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
