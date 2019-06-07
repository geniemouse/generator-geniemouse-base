// Import packages
const YeomanGenerator = require("yeoman-generator");
const chalk = require("chalk");
const commandExists = require("command-exists").sync;
const mkdirp = require("mkdirp");
const yosay = require("yosay");

const options = require("../config/options");
const { sortByKeyName } = require("../utils");

module.exports = class Base extends YeomanGenerator {
    constructor(args, opts) {
        // Don't replace Generator's parameters ;)
        super(args, opts);

        // Generator running with current options flags...
        Object.keys(options).map((optionName) => {
            return this.option(optionName, options[optionName]);
        });
    }

    createDirectory(dir) {
        return mkdirp(dir, (err) => {
            if (typeof this.log === "function") {
                return this.log(err || `${chalk.green("create directory")} ${dir}`);
            }
        });
    }

    mergeJsonTemplate(fileOptions) {
        const { input, output, data } = fileOptions;
        const destination = this.destinationPath(output);
        const template = this.templatePath(input);

        if (this.fs.exists(destination)) {
            const storedContent = this.fs.readJSON(data ? destination : template, {});
            if (data) {
                this.fs.copyTpl(template, destination, data);
            }
            return this.fs.extendJSON(destination, storedContent);
        }

        // No JSON file exists in destination location yet, so handle it as normal
        return this.fs[data ? "copyTpl" : "copy"](template, destination, data);
    }

    _messageFactory(message) {
        return !this.options["skip-welcome-message"] && !this.options.isBase
            ? this.log(yosay(message))
            : this.log(message);
    }

    welcomeMessage(message, subGeneratorOptions = {}) {
        const { subgenerator } = subGeneratorOptions;
        const baseMessage = !this.options["skip-welcome-message"]
            ? `'Allo 'allo! Out of the box, I include ${message}`
            : chalk.blue("Installing base project scaffolding");
        if (subgenerator) {
            return this._messageFactory(chalk.blue(`Installing ${message} to this project location`));
        }
        return this._messageFactory(baseMessage);
    }

    // @TODO: see how to call this. Non-essential
    sortPackageDependencies() {
        const pkg = this.fs.readJSON(this.destinationPath("package.json"), {});
        return this.fs.extendJSON(this.destinationPath("package.json"), {
            dependencies: sortByKeyName(pkg.dependencies),
            devDependencies: sortByKeyName(pkg.devDependencies),
            peerDependencies: sortByKeyName(pkg.peerDependencies)
        });
    }

    installBase() {
        const hasYarn = commandExists("yarn");
        if (!this.options.isBase) {
            this.installDependencies({
                npm: !hasYarn,
                yarn: hasYarn,
                bower: false,
                skipMessage: this.options["skip-install-message"],
                skipInstall: this.options["skip-install"]
            });
        }
    }

    goodbyeMessage(message, subGeneratorOptions = {}) {
        const { subgenerator } = subGeneratorOptions;
        const baseMessage = `${chalk.blue("Finished generating base project files")}. See the ${chalk.bold.italic(
            "README.md"
        )} file further details\n`;
        if (subgenerator) {
            return this._messageFactory(chalk.blue(`Finished installing ${message}`));
        }
        return this._messageFactory(baseMessage);
    }
};
