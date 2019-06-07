// Import packages
const chalk = require("chalk");
const { capitalize } = require("lodash");

// Config files
const BaseGenerator = require("../base");
const prompts = require("../../config/prompts");

// Utils
const { usernamePattern } = require("../../utils");

// Generator package.json (for info)
const generatorPackageJson = require("../../package.json");

/**
 * Base generator
 */
module.exports = class extends BaseGenerator {
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

    initializing() {
        this.welcomeMessage(
            `${chalk.green(".editorconfig")}, ${chalk.green(".gitattributes")}
            & ${chalk.green(".gitignore")} files. Nice and simple!`
        );

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

    configuring() {
        const rootFiles = [".editorconfig", ".gitattributes", ".gitignore", "CHANGELOG.md"];
        rootFiles.forEach((file) => {
            this.fs.copy(this.templatePath(file), this.destinationPath(file));
        });
    }

    eslintTask() {
        if (this.features.hasESLint) {
            this.composeWith(require.resolve("../eslint"), {
                "features": this.feature,
                "isBase": true,
                "skip-install": this.options["skip-install"]
            });
        }
    }

    prettierTask() {
        if (this.features.hasPrettier) {
            this.composeWith(require.resolve("../prettier"), {
                "isBase": true,
                "prettierrc": this.data.prettierrc,
                "skip-install": this.options["skip-install"]
            });
        }
    }

    jestTask() {
        if (this.features.hasJest) {
            this.composeWith(require.resolve("../jest"), {
                "isBase": true,
                "skip-install": this.options["skip-install"]
            });
        }
    }

    directoriesTask() {
        this.directories.forEach((dir) => {
            this.createDirectory(dir);
        });
    }

    writing() {
        this.fs.copyTpl(this.templatePath("_README.md"), this.destinationPath("README.md"), this.data);
        // Handle updates to package.json file
        this.mergeJsonTemplate({ input: "_package.json", output: "package.json", data: this.data });
    }

    install() {
        this.installBase();
    }

    end() {
        this.goodbyeMessage();
    }
};
