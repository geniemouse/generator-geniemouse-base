const path = require("path");
const { kebabCase } = require("lodash");

const { usernamePattern } = require("../utils");

/**
 * Base generator questions shown (in order) on the commandline
 */
const prompts = [
    /**
     * `package.json` details
     */
    {
        type: "input",
        name: "appname",
        message: "Project app name?",
        suffix: " (Any entry will be kebab-cased)",
        default: path.basename(process.cwd()),
        filter: (str) => {
            const s = str.trim();
            const nameItems = s.split(usernamePattern);
            const lastItem = nameItems.length - 1;
            if (usernamePattern.test(s)) {
                nameItems[0] = String(s.match(usernamePattern));
            }
            nameItems[lastItem] = kebabCase(nameItems[lastItem]);
            return nameItems.join("");
        },
        validate: (str) => {
            return str.trim().length > 0;
        }
    },
    {
        type: "input",
        name: "version",
        message: "Version?",
        default: "1.0.0",
        validate: (str) => {
            return /^(\d+.){2}\d+$/.test(str.trim());
        }
    },
    {
        type: "input",
        name: "description",
        message: "Description:"
    },

    /**
     * Project features
     */
    {
        type: "checkbox",
        name: "features",
        message: "Which features would you like to include?",
        choices: [
            {
                name: " ESLint",
                value: "includeESLint",
                checked: true
            },
            {
                name: " Prettier",
                value: "includePrettier",
                checked: true
            },
            {
                name: " Jest",
                value: "includeJest",
                checked: true
            }
        ]
    }
];

module.exports = prompts;
