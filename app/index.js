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
const packageJson = require("../package.json");

/**
 * Base generator
 */
module.exports = class extends YeomanGenerator {
    constructor(args, opts) {
        // Don't replace Generator's parameters ;)
        super(args, opts);
        // Add options, if any passed-in from command
        Object.keys(options).map((optionName) => {
            return this.option(optionName, options[optionName]);
        });
    }

    _copy(input, output) {
        return this.fs.copy(this.templatePath(input), this.destinationPath(output));
    }

    _copyTemplate(input, output, data) {
        return this.fs.copyTpl(this.templatePath(input), this.destinationPath(output), data);
    }

    // Generator steps
    initializing() {
        // The generator package.json
        this.pkg = packageJson;
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
            this.answers = answers;
            this.answers.friendlyname = (() => {
                return capitalize(answers.appname.replace(usernamePattern, "").replace(/-/g, " "));
            })();

            this.includeESLint = answers.features.includes("includeESLint");
            this.includePrettier = answers.features.includes("includePrettier");
            this.includeJest = answers.features.includes("includeJest");
        });
    }

    // Directories & files; including parsing data into them
    writing() {
        const { appname, description, friendlyname, version } = this.answers;
        const templateData = {
            appname,
            description,
            friendlyname,
            version,
            date: new Date().toISOString().split("T")[0],
            generator: {
                name: this.pkg.name,
                version: this.pkg.version
            },
            includeESLint: this.includeESLint,
            includePrettier: this.includePrettier,
            includeJest: this.includeJest
        };

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
            this._copyTemplate.call(this, file.input, file.output, templateData);
        });

        this.fs.extendJSON(this.destinationPath("package.json"), makePackage(templateData));

        if (this.includeESLint) {
            this._copy.call(this, ".eslintignore", ".eslintignore");
            this._copyTemplate.call(this, ".eslintrc", ".eslintrc", templateData);
            this.fs.extendJSON(this.destinationPath(".eslintrc"), makeESLintConfig(templateData));
        }
    }

    prettierTask() {
        if (this.includePrettier) {
            this._copy.call(this, ".prettierignore", ".prettierignore");
        }
    }

    jestTask() {
        if (this.includeJest) {
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
