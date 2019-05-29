const { sortByKeyName } = require("../utils");

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

function setFeatureObject(feature, returnObj) {
    return feature ? returnObj : {};
}

function setFeatureOrUndefined(feature, returnSettings) {
    if (!feature) {
        return;
    }
    return returnSettings;
}

function setScripts(data) {
    const scripts = Object.assign(
        {},
        setFeatureObject(data.includeESLint, {
            lint: "eslint ./"
        }),
        setFeatureObject(data.includeJest, {
            "test": "jest ./",
            "test:coverage": "jest ./ --coverage",
            "test:watch": "jest ./ --watchAll"
        })
    );
    return sortByKeyName(scripts);
}

function setDevDependencies(data) {
    const collection = Object.assign(
        {},
        setFeatureObject(data.includeESLint, devDependencies.eslint),
        setFeatureObject(data.includePrettier, devDependencies.prettier),
        setFeatureObject(data.includeESLint && data.includePrettier, devDependencies.eslintPrettier),
        setFeatureObject(data.includeJest, devDependencies.jest)
    );
    // Sorting by keyname is an optional nicety;
    // consistentcy with how packages are normally listed in `package.json`
    return sortByKeyName(collection);
}

module.exports = function makePackage(data) {
    return {
        jest: setFeatureOrUndefined(data.includeJest, {
            verbose: false,
            collectCoverage: false
        }),
        prettier: setFeatureOrUndefined(data.includePrettier, "@geniemouse/prettier-config"),
        scripts: setScripts(data),
        dependencies: {},
        devDependencies: setDevDependencies(data),
        peerDependencies: {}
    };
};
