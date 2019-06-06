const { configObject, configOrUndefined, sortByKeyName } = require("../utils");

const devDependencies = {
    prettier: {
        "@geniemouse/prettier-config": "^1.1.3",
        "prettier": "^1.17.1"
    }
};

function setDevDependencies(features) {
    const { prettier } = devDependencies;
    const collection = Object.assign({}, configObject(features.hasPrettier, prettier));
    // Sorting by keyname is an optional nicety;
    // consistentcy with how packages are normally listed in `package.json`
    return sortByKeyName(collection);
}

module.exports = function makePackage(data) {
    const { features } = data;
    return {
        prettier: configOrUndefined(features.hasPrettier, "@geniemouse/prettier-config"),
        devDependencies: setDevDependencies(features)
    };
};
