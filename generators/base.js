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
 *     - _mergeJsonTemplate
 *     - _sortPackageDependencies
 * 4. Messaging utilities
 *     - _messageFactory
 *     - _welcomeMessage
 *     - _goodbyeMessage
 */

const YeomanGenerator = require("yeoman-generator");
const chalk = require("chalk");
const commandExists = require("command-exists").sync;
const mkdirp = require("mkdirp");
const yosay = require("yosay");

const options = require("../config/options");
const { sortByKeyName } = require("../utils");

class Base extends YeomanGenerator {
    /**
     * 1. constructor (Base)
     * Generator/Sub-generator class can also have their own constructors, if necessary
     */

    constructor(args, opts) {
        // Don't replace Generator's parameters ;)
        super(args, opts);

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
     * Handle combining multiple generator templates of the same name i.e. `_package.json`` file
     * @param  {Object} fileOptions -- {input: FILE_PATH, output: FILE_PATH, data: { optional }}
     * @return {Undefined}
     */
    _mergeJsonTemplate(fileOptions) {
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

    /**
     * Alphabetise package dependencies, just like regular package install process does.
     * Good for human-readable content.
     * @return {Undefined}
     */
    _sortPackageDependencies() {
        const pkg = this.fs.readJSON(this.destinationPath("package.json"), {});
        const pkgBlankedDependencies = Object.assign({}, pkg, {
            dependencies: undefined,
            devDependencies: undefined,
            peerDependencies: undefined
        });

        this.fs.writeJSON(this.destinationPath("package.json"), pkgBlankedDependencies);
        // Then rewrite post-processing
        return this.fs.extendJSON(this.destinationPath("package.json"), {
            dependencies: sortByKeyName(pkg.dependencies),
            devDependencies: sortByKeyName(pkg.devDependencies),
            peerDependencies: sortByKeyName(pkg.peerDependencies)
        });
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
            : chalk.blue("Installing base project scaffolding");
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
