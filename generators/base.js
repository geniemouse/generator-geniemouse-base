/**
 * Base class
 * ==========
 * Extends YeomanGenerator to share common methods with generator and sub-generators.
 * Methods written here (with exception of constructor) sit outside the Yeoman generator
 * run-loop; don't get called by generators automatically.
 *
 * 1. constructor
 * 2. General utilites
 *     - _createDirectory
 *     - _installBase
 * 3. JSON & package.json utilities
 *     - _handleJsonFile
 *     - _sortPackageDependencies
 * 4. Messaging utilities
 *     - _messageFactory
 *     - _welcomeMessage
 *     - _goodbyeMessage
 */

const YeomanGenerator = require("yeoman-generator");
const chalk = require("chalk");
const commandExists = require("command-exists").sync;
const extend = require("deep-extend");
const mkdirp = require("mkdirp");
const yosay = require("yosay");

const options = require("../config/options");
const { hasDataSpaces, isPackageJson, priorityPackageData, sortPackageJson } = require("../utils");

class Base extends YeomanGenerator {
    /**
     * 1. constructor (Base)
     * Generator/Sub-generator class can also have their own constructors, if necessary
     */

    constructor(args, opts) {
        // Don't replace Generator's parameters ;)
        super(args, opts);

        // @TODO: Sort out saving
        this.config.save();

        // Generator running with current options flags...
        Object.keys(options).map((optionName) => {
            return this.option(optionName, options[optionName]);
        });
    }

    /**
     * 2. General utilites
     */

    _createDirectory(dir) {
        return mkdirp(dir, (err) => {
            return this.log(err || `${chalk.green("create directory")} ${dir}`);
        });
    }

    _installBase() {
        const hasYarn = commandExists("yarn");
        if (!this.options.generator) {
            this.installDependencies({
                npm: !hasYarn,
                yarn: hasYarn,
                bower: false,
                skipMessage: this.options["skip-install-message"],
                skipInstall: this.options["skip-install"]
            });
        }
    }

    /**
     * 3. JSON & package.json utilities
     */

    /**
     * Handle extending templates files with data i.e. `_package.json` file
     * @param  {Object} fileOptions -- {input: FILE_PATH, output: FILE_PATH, data: { optional }}
     * @return {Undefined}
     */
    _handleJsonFile(fileOptions) {
        const { input, output, data } = fileOptions;
        const destination = this.destinationPath(output);
        const template = this.templatePath(input);
        return this._mergeJsonData(destination, template, data || {});
    }

    _mergeJsonData(destination, template, data) {
        const destinationData = this.fs.readJSON(destination, {});
        const templateData = this.fs.readJSON(template, {});
        const processedTemplateData = this.fs.readJSON(
            destination,
            this.fs[hasDataSpaces(templateData) ? "copyTpl" : "copy"](template, destination, data)
        );
        const dataOrder = [destinationData, processedTemplateData, data];

        if (isPackageJson(destination)) {
            dataOrder.push(priorityPackageData(processedTemplateData));
            return this.fs.writeJSON(destination, sortPackageJson(extend(...dataOrder)));
        }
        return this.fs.extendJSON(destination, extend(...dataOrder));
    }

    /**
     * Messaging utilities
     */

    /**
     * Decide message output: basic log or yosay message
     * @param  {String} message
     * @return {Function}
     */
    _messageFactory(message) {
        return !this.options["skip-welcome-message"] && !this.options.generator
            ? this.log(yosay(message))
            : this.log(message);
    }

    /**
     * Generator & sub-generator `initializing` message template
     * @param  {String} message
     * @param  {Object} subGeneratorOptions -- { subgenerator: true }
     * @return {Function}
     */
    _welcomeMessage(message, subGeneratorOptions = {}) {
        const { subgenerator } = subGeneratorOptions;
        const baseMessage = !this.options["skip-welcome-message"]
            ? `'Allo 'allo! Out of the box, I include ${message}`
            : /* istanbul ignore next */
              chalk.blue("Installing base project scaffolding");
        if (subgenerator) {
            return this._messageFactory(chalk.blue(`Installing ${message} to this project location`));
        }
        return this._messageFactory(baseMessage);
    }

    /**
     * Generator & sub-generator `end` message template
     * @param  {String} message
     * @param  {Object} subGeneratorOptions -- { subgenerator: true }
     * @return {Function}
     */
    _goodbyeMessage(message, subGeneratorOptions = {}) {
        const { subgenerator } = subGeneratorOptions;
        const baseMessage = `${chalk.blue("Finished generating base project files")}. See the ${chalk.bold.italic(
            "README.md"
        )} file further details\n`;
        if (subgenerator) {
            return this._messageFactory(chalk.blue(`Finished installing ${message}`));
        }
        return this._messageFactory(baseMessage);
    }
}

module.exports = Base;
