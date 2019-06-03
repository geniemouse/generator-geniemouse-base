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

function setScripts(features) {
    const scripts = Object.assign(
        {},
        configObject(features.hasESLint, {
            lint: "eslint ./"
        }),
        configObject(features.hasJest, {
            "test": "jest ./",
            "test:coverage": "jest ./ --coverage",
            "test:watch": "jest ./ --watchAll"
        })
    );
    return sortByKeyName(scripts);
}

function setDevDependencies(features) {
    const { eslint, prettier, eslintPrettier, jest } = devDependencies;
    const collection = Object.assign(
        {},
        configObject(features.hasESLint, eslint),
        configObject(features.hasPrettier, prettier),
        configObject(features.hasESLint && features.hasPrettier, eslintPrettier),
        configObject(features.hasJest, jest)
    );
    // Sorting by keyname is an optional nicety;
    // consistentcy with how packages are normally listed in `package.json`
    return sortByKeyName(collection);
}

module.exports = function makePackage(data) {
    const { features } = data;
    return {
        jest: configOrUndefined(features.hasJest, {
            verbose: false,
            collectCoverage: false
        }),
        prettier: configOrUndefined(features.hasPrettier, "@geniemouse/prettier-config"),
        scripts: setScripts(features),
        dependencies: {},
        devDependencies: setDevDependencies(features),
        peerDependencies: {}
    };
};
