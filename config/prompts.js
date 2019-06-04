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
                value: "hasESLint",
                checked: true
            },
            {
                name: " Prettier",
                value: "hasPrettier",
                checked: true
            },
            {
                name: " Jest",
                value: "hasJest",
                checked: true
            }
        ]
    },
    /**
     * Optional .prettierrc file step, if Prettier feature has been requested
     */
    {
        type: "confirm",
        name: "prettierrc",
        message: "Would you like a .prettierrc.js file to be created?",
        suffix: " (For overriding bundled Prettier config rules)",
        store: true,
        when: (answers) => answers.features.includes("hasPrettier")
    },
    /**
     * Initial project directories
     */
    {
        type: "input",
        name: "directories",
        message: "Initial directories:",
        suffix: " (Comma-separated list, nested directories separated by /)",
        default: ["app"],
        store: true,
        filter: (dirs) => {
            if (typeof dirs === "string") {
                return dirs.split(",").map((dir) => dir.trim());
            }
            return dirs;
        }
    }
];

module.exports = prompts;
