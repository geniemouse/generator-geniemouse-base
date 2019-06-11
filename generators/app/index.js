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

        this.data = {};
        this.directories = [];
        this.features = [];
        this.has = {}; // Future store for feature flags, e.g. `this.has.eslint``
    }

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

            this.data = Object.assign({}, answers, additionalData);
            this.directories = answers.directories;
            this.features = answers.features;
            this.has = additionalData.features;
        });
    }

    configuring() {
        const rootFiles = [".editorconfig", ".gitattributes", ".gitignore", "CHANGELOG.md"];
        rootFiles.forEach((file) => {
            this.fs.copy(this.templatePath(file), this.destinationPath(file));
        });
    }

    default() {
        this.features.forEach((feature) => {
            this.composeWith(require.resolve(`../${feature}`), {
                features: this.has,
                generator: true,
                prettierrc: this.data.prettierrc
            });
        });
    }

    directoriesTask() {
        this.directories.forEach((dir) => {
            this._createDirectory(dir);
        });
    }

    writing() {
        this.fs.copyTpl(this.templatePath("_README.md"), this.destinationPath("README.md"), this.data);
        // Handle updates to package.json file
        this._handleJsonFile({ input: "_package.json", output: "package.json", data: this.data });
        this._sortPackageDependencies();
        this._sortPackageKeys();
    }

    install() {
        this._installBase();
    }

    end() {
        this._goodbyeMessage();
    }
}

module.exports = App;
