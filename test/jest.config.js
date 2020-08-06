const { resolve } = require("path");
const rootDir = resolve(__dirname, "..");
const rootConfig = require(`${rootDir}/jest.config.js`);

module.exports = {
    ...rootConfig,
    ...{
        rootDir,
        displayName: "end2end-tests",
        setupFilesAfterEnv: ["<rootDir>/test/jest-setup.ts"],
        testMatch: ["<rootDir>/test/**/*.test.ts"],
        testEnvironment: "node",
    },
};
