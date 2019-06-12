/**
 * App class
 * =========
 * Extends Base
 * Default generator class `yo geniemouse-base`
 */

const chalk = require("chalk");
const { capitalize } = require("lodash");

const BaseYeomanGenerator = require("../base");
const prompts = require("../../config/prompts");
const { usernamePattern } = require("../../utils");
const generatorPackageJson = require("../../package.json");

class App extends BaseYeomanGenerator {
    _setFriendlyName(str) {
        return capitalize(str.replace(usernamePattern, "").replace(/-/g, " "));
    }

    _setFeatureFlags(features) {
        return features.reduce((accumulator, feature) => {
            accumulator[feature] = features.includes(feature);
            return accumulator;
        }, {});
    }

    initializing() {
        this._welcomeMessage(
            `${chalk.green(".editorconfig")}, ${chalk.green(".gitattributes")}
            & ${chalk.green(".gitignore")} files. Nice and simple!`
        );

        this.answers = {};
        this.directoriesList = [];
        this.featuresList = [];
    }

    prompting() {
        return this.prompt(prompts).then((answers) => {
            // Update config
            this.config.set("features", this._setFeatureFlags(answers.featuresList));
            this.config.set("prettierrc", this.answers.prettierrc);

            this.directoriesList = answers.directoriesList;
            this.featuresList = answers.featuresList;

            // Combine all answers data; the set passed to template files
            this.answers = Object.assign(
                {},
                answers,
                // Add any additional data:
                {
                    friendlyname: this._setFriendlyName(answers.appname),
                    features: this.config.get("features"),
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
        this._goodbyeMessage();
    }
}

module.exports = App;
