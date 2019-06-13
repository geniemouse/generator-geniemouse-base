/**
 * App class
 * =========
 * Extends Base
 * Default generator class `yo geniemouse-base`
 */

const chalk = require("chalk");
const { capitalize } = require("lodash");
const yosay = require("yosay");

const BaseYeomanGenerator = require("../base");
const prompts = require("../../config/prompts");
const { usernamePattern } = require("../../utils");

class App extends BaseYeomanGenerator {
    constructor(args, opts) {
        // Don't replace Generator's parameters ;)
        super(args, opts);

        // @note: be careful adding config defaults
        // target them to specific generators
        this.config.defaults({
            promptValues: {
                directoriesList: ["app"]
            }
        });
    }

    _setFriendlyName(str) {
        return capitalize(str.replace(usernamePattern, "").replace(/-/g, " "));
    }

    _welcomeMessage(message) {
        if (this.options["skip-welcome-message"] || this.options["skip-message"]) {
            return this.log(chalk.blue("Installing project scaffolding"));
        }
        return this.log(yosay(message));
    }

    initializing() {
        this._welcomeMessage(
            `'Allo 'allo! Out of the box, I can install
            ${chalk.green(".editorconfig")}, ${chalk.green(".gitattributes")}
            & ${chalk.green(".gitignore")} files. Nice and simple!`
        );

        this.answers = {};
        this.directoriesList = [];
        this.featuresList = [];
    }

    prompting() {
        return this.prompt(prompts).then((answers) => {
            const features = answers.featuresList.reduce((accumulator, feature) => {
                this.config.set(feature, true);
                accumulator[feature] = true;
                return accumulator;
            }, {});

            this.directoriesList = answers.directoriesList;
            this.featuresList = answers.featuresList;

            // Combine all answers data; the set passed to template files
            this.answers = Object.assign(
                {},
                answers,
                // Add any additional data:
                {
                    friendlyname: this._setFriendlyName(answers.appname),
                    features: features
                }
            );
        });
    }

    configuring() {
        const rootFiles = [".editorconfig", ".gitattributes", ".gitignore", "CHANGELOG.md"];
        rootFiles.forEach((file) => {
            this.fs.copy(this.templatePath(file), this.destinationPath(file));
        });
    }

    default() {
        this.featuresList.forEach((feature) => {
            this.composeWith(require.resolve(`../${feature}`), {
                generator: true
            });
        });
    }

    directoriesTask() {
        this.directoriesList.forEach((dir) => {
            this._createDirectory(dir);
        });
    }

    writing() {
        this.fs.copyTpl(this.templatePath("_README.md"), this.destinationPath("README.md"), this.answers);
        // Handle updates to package.json file
        this._handleJsonFile({ input: "_package.json", output: "package.json", data: this.answers });
    }

    install() {
        this._installBase();
    }

    end() {
        this._goodbyeMessage("skeleton project files", { showReadMe: true });
    }
}

module.exports = App;
