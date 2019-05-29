const path = require("path");

/**
 * Base generator questions shown (in order) on the commandline
 */
const prompts = [
    // `package.json` questions:
    {
        type: "input",
        name: "appname",
        message: "What is the project name?",
        default: path.basename(process.cwd()),
        validate: (str) => {
            return str.trim().length > 0;
        }
    },
    // @TODO: Add description & version number
    {
        type: "checkbox",
        name: "codefeatures",
        message: "Which of the following code features would you like to include?",
        choices: [
            {
                name: "ESLint",
                value: "includeESLint",
                checked: true
            },
            {
                name: "Prettier",
                value: "includePrettier",
                checked: true
            }
        ]
    }
];

module.exports = prompts;
