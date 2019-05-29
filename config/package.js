const { configObject, configOrUndefined, sortByKeyName } = require("../utils");

const devDependencies = {
    eslint: {
        "eslint": "^5.16.0",
        "eslint-config-airbnb-base": "^13.1.0",
        "eslint-plugin-import": "^2.17.3"
    },
    prettier: {
        "@geniemouse/prettier-config": "^1.1.3",
        "prettier": "^1.17.1"
    },
    eslintPrettier: {
        "eslint-config-prettier": "^4.3.0",
        "eslint-plugin-prettier": "^3.1.0"
    },
    jest: {
        jest: "^24.8.0"
    }
};

function setScripts(data) {
    const { includeESLint, includeJest } = data;
    const scripts = Object.assign(
        {},
        configObject(includeESLint, {
            lint: "eslint ./"
        }),
        configObject(includeJest, {
            "test": "jest ./",
            "test:coverage": "jest ./ --coverage",
            "test:watch": "jest ./ --watchAll"
        })
    );
    return sortByKeyName(scripts);
}

function setDevDependencies(data) {
    const { includeESLint, includePrettier, includeJest } = data;
    const { eslint, prettier, eslintPrettier, jest } = devDependencies;
    const collection = Object.assign(
        {},
        configObject(includeESLint, eslint),
        configObject(includePrettier, prettier),
        configObject(includeESLint && includePrettier, eslintPrettier),
        configObject(includeJest, jest)
    );
    // Sorting by keyname is an optional nicety;
    // consistentcy with how packages are normally listed in `package.json`
    return sortByKeyName(collection);
}

module.exports = function makePackage(data) {
    return {
        jest: configOrUndefined(data.includeJest, {
            verbose: false,
            collectCoverage: false
        }),
        prettier: configOrUndefined(data.includePrettier, "@geniemouse/prettier-config"),
        scripts: setScripts(data),
        dependencies: {},
        devDependencies: setDevDependencies(data),
        peerDependencies: {}
    };
};
