const ENV = require("./app/config/env-config");

module.exports = {
    presets: [
        [
            '@babel/preset-env',
            {
                targets: {
                    esmodules: true,
                },
            },
        ],
    ],
    plugins: [
        "inline-json-import",
        "@babel/plugin-proposal-class-properties",
        "@babel/plugin-proposal-private-methods",
        [
            "module-resolver",
            {
                alias: {
                    "Controllers": "./app/src/controllers/",
                    "Models": "./app/src/models/",
                    "Tools": "./app/src/tools/",
                }
            }
        ],
        [
            "transform-define",
            { ...ENV },
        ],
    ],
};