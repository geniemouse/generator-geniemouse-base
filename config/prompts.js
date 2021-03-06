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
        suffix: "\n(Any entry will be kebab-cased)",
        store: true,
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
        store: true,
        default: "1.0.0",
        validate: (str) => {
            return /^(\d+.){2}\d+$/.test(str.trim());
        }
    },
    {
        type: "input",
        name: "description",
        message: "Description:",
        store: true
    },

    /**
     * Project features
     */
    {
        type: "checkbox",
        name: "featuresList",
        message: "Which features would you like to include?",
        choices: [
            {
                name: " Prettier",
                value: "prettier",
                checked: true
            },
            {
                name: " Jest",
                value: "jest",
                checked: true
            },
            {
                name: " ESLint",
                value: "eslint",
                checked: true
            }
        ]
    },

    /**
     * Initial project directories
     */
    {
        type: "input",
        name: "directoriesList",
        message: "Initial directories:",
        suffix: "\n(Comma-separated list, nested directories separated by /)",
        store: true,
        filter: (dirs) => {
            if (typeof dirs === "string") {
                const dirsStr = dirs.trim();
                return dirsStr.length ? dirsStr.split(",").map((dir) => dir.trim()) : [];
            }
            return dirs;
        }
    }
];

module.exports = prompts;
