/**
 * Base class
 * ==========
 * Extends YeomanGenerator to share common methods with generator and sub-generators.
 * - Methods written here (with exception of constructor) sit outside the Yeoman generator
 *     run-loop; won't get called by generators automatically.
 * - Also kept with the Yeoman generator convention of prefixing 'private' method names
 *     with an underscore
 *
 * 1. constructor
 * 2. General utilites
 *     - _createDirectory
 *     - _installBase
 * 3. JSON & package.json utilities
 *     - _handleJsonFile
 *     - _mergeJsonData
 * 4. Messaging utilities
 *     - _logMessage
 *     - _welcomeSubGeneratorMessage
 *     - _goodbyeMessage
 */

const YeomanGenerator = require("yeoman-generator");
const chalk = require("chalk");
const commandExists = require("command-exists").sync;
const extend = require("deep-extend");
const mkdirp = require("mkdirp");

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

        // Create initial `.yo-rc.json` file, if it doesn't exist already
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
     * Handle extending JSON templates files with data i.e. `_package.json` file
     * @param  {Object} fileOptions -- {input: FILE_PATH, output: FILE_PATH, data: { optional }}
     * @return {Undefined}
     */
    _handleJsonFile(fileOptions) {
        const { input, output, data } = fileOptions;
        const destination = this.destinationPath(output);
        const template = this.templatePath(input);
        return this._mergeJsonData(destination, template, data || {});
    }

    /**
     * Handle reading, copying & parsing of templates files, with particular
     * focus on merging various datasets in a proscribed & predictable order
     * @param  {String} destination
     * @param  {String} template
     * @param  {Object} data -- Optional extra data
     * @return {Undefined}
     */
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
     * Read various message options, log message or not
     * @param  {String} message
     * @return {Function|Undefined}
     */
    _logMessage(message) {
        if (this.options["skip-message"] || this.options["generator"]) {
            return;
        }
        return this.log(message);
    }

    /**
     * Log welcome message for sub-generators
     * @param  {String} generatorName
     * @return {Function}
     */
    _welcomeSubGeneratorMessage(generatorName) {
        return this._logMessage(chalk.blue(`Installing ${generatorName}`));
    }

    /**
     * Generator `end` message template
     * @param  {String} generatorName
     * @param  {Object} messageOptions -- { showReadMe: true }
     * @return {Function}
     */
    _goodbyeMessage(generatorName, messageOptions = {}) {
        const { showReadMe } = messageOptions;
        const readMeMessage = `See the ${chalk.bold.italic("README.md")} file further details.\n`;
        let mainMessage = chalk.blue(`Finished installing ${generatorName}\n`);
        if (showReadMe) {
            mainMessage += readMeMessage;
        }
        return this._logMessage(mainMessage);
    }
}

module.exports = Base;
