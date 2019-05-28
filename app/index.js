// Import packages
const YeomanGenerator = require("yeoman-generator");
const commandExists = require("command-exists").sync;
const _ = require("lodash");
const mkdirp = require("mkdirp");
const yosay = require("yosay");

// Import local files
const options = require("./config/options");
const prompts = require("./config/prompts");
const files = require("./config/files");

/**
 * Base generator
 */
module.exports = class extends YeomanGenerator {
    constructor(args, opts) {
        // Don't replace Generator's parameters ;)
        super(args, opts);
        // Add options, if any passed-in from command
        Object.keys(options).map((optionName) => {
            this.option(optionName, options[optionName]);
        });
    }

    // Generator steps
    initializing() {
        // The generator package.json
        this.pkg = require("../package.json");
        // @TODO: any other set-up?
    }

    // Asking the set-up questions
    prompting() {
        if (!this.options["skip-welcome-message"]) {
            this.log(
                yosay(
                    "'Allo 'allo! Out of the box I include .editorconfig, .gitattributes & .gitignore files, plus ESLint, Prettier and Jest for unit testing"
                )
            );
        }

        return this.prompt(prompts).then((answers) => {
            this.appname = _.kebabCase(answers.appname);
        });
    }

    // Directories & files; including parsing data into them
    writing() {
        const templateData = {
            appname: this.appname,
            date: new Date().toISOString().split("T")[0],
            name: this.pkg.name,
            version: this.pkg.version
            // @TODO: add any optional flags, so file like _package.json can call on them
            // includeARG_NAME: this.options[ARG_NAME]
            // includeFEATURE_NAME: this.includeFEATURE_NAME
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

        // Files to parse before copying over
        files.toParse.forEach((file) => {
            copyTemplate.call(this, file.input, file.output, templateData);
        });

        // @TODO: add the rest... e.g. folder structure
    }

    // Run the package install
    install() {
        const hasYarn = commandExists("yarn");
        this.installDependencies({
            npm: !hasYarn,
            yarn: hasYarn,
            bower: false,
            skipMessage: this.options["skip-install-message"]
        });
    }

    // Tidy-up
    // end() {}

    // Testing
    // test() {}
};
