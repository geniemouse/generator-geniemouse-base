const chalk = require("chalk");
const mkdirp = require("mkdirp");

const usernamePattern = /^@[a-z0-9-]+\//i;

/**
 * Utility: Create an object with alphabetized key names from another
 * - Although this doesn't matter to JS, humans will find this easier to parse
 * @param  {Object} obj
 * @return {Object}
 */
function sortByKeyName(obj) {
    return Object.keys(obj)
        .sort()
        .reduce((result, key) => {
            result[key] = obj[key];
            return result;
        }, {});
}

function createDirectory(dir) {
    return mkdirp(dir, (err) => {
        if (typeof this.log === "function") {
            return this.log(err || `${chalk.green("create directory")} ${dir}`);
        }
    });
}

function mergeJSON(fileOptions) {
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

    // No package.json file exists yet, so copy/copy & parse data to template
    return this.fs[data ? "copyTpl" : "copy"](template, destination, data);
    // return data ? this.fs.copyTpl(template, destination, data) : this.fs.copy(template, destination);
}

function configTemplate(options) {
    const { feature, settings, empty } = options;
    return feature ? settings : empty;
}

function configArray(feature, settings) {
    return configTemplate({ feature, settings, empty: [] });
}

function configObject(feature, settings) {
    return configTemplate({ feature, settings, empty: {} });
}

function configOrUndefined(feature, settings) {
    if (!feature) {
        return undefined;
    }
    return settings;
}

module.exports = {
    configArray,
    configObject,
    configOrUndefined,
    createDirectory,
    mergeJSON,
    sortByKeyName,
    usernamePattern
};
