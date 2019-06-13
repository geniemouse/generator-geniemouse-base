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
const generatorPackageJson = require("../../package.json");

class App extends BaseYeomanGenerator {
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

            // @TODO: This should be coming out when we hand off to Prettier sub-generator
            this.config.set("prettierrc", answers.prettierrc);

            this.directoriesList = answers.directoriesList;
            this.featuresList = answers.featuresList;

            // Combine all answers data; the set passed to template files
            this.answers = Object.assign(
                {},
                answers,
                // Add any additional data:
                {
                    friendlyname: this._setFriendlyName(answers.appname),
                    features: features,
                    // @TODO: Remove generator block, not in use
                    // Information:
                    // Add details of the Yeoman generator being used.
                    // Useful in debugging and generated documentation.
                    generator: {
                        date: new Date().toISOString().split("T")[0],
                        name: generatorPackageJson.name,
                        version: generatorPackageJson.version
                    }
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
