// Import packages
const YeomanGenerator = require("yeoman-generator");
const chalk = require("chalk");
const commandExists = require("command-exists").sync;
const _ = require("lodash");
const mkdirp = require("mkdirp");
const yosay = require("yosay");

// Import local files
const files = require("../config/files");
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

    // Generator steps
    initializing() {
        // The generator package.json
        this.pkg = packageJson;
        // @TODO: any other set-up?
    }

    // Asking the set-up questions
    prompting() {
        function hasFeature(featureName, features) {
            return features && features.includes(featureName);
        }

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
            this.name = answers.appname;
            this.appname = _.kebabCase(this.name);
            this.version = answers.version;
            this.description = answers.description;
            this.includeESLint = hasFeature("includeESLint", answers.codefeatures);
            this.includePrettier = hasFeature("includePrettier", answers.codefeatures);
            this.includeJest = hasFeature("includeJest", answers.codefeatures);
        });
    }

    // Directories & files; including parsing data into them
    writing() {
        const templateData = {
            name: this.name,
            appname: this.appname,
            version: this.version,
            description: this.description,
            date: new Date().toISOString().split("T")[0],
            generator: {
                name: this.pkg.name,
                version: this.pkg.version
            },
            includeESLint: this.includeESLint,
            includePrettier: this.includePrettier,
            includeJest: this.includeJest
        };

        function copy(input, output) {
            return this.fs.copy(this.templatePath(input), this.destinationPath(output));
        }

        function copyTemplate(input, output, data) {
            return this.fs.copyTpl(this.templatePath(input), this.destinationPath(output), data);
        }

        // Root files (straight copying task)
        files.root.forEach((file) => {
            copy.call(this, file, file);
        });

        // Copy files from one location to another
        files.toCopy.forEach((file) => {
            copy.call(this, file.input, file.output);
        });

        // Files to parse before copying over
        files.toParse.forEach((file) => {
            copyTemplate.call(this, file.input, file.output, templateData);
        });

        this.fs.extendJSON(this.destinationPath("package.json"), makePackage(templateData));

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
    // end() {}

    // Testing
    // test() {}
};
