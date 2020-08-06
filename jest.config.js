const { resolve } = require("path");
const rootDir = resolve(__dirname);

module.exports = {
    rootDir,
    displayName: "root-tests",
    preset: "ts-jest",
    clearMocks: true,
    testMatch: ["<rootDir>/src/**/*.test.ts"],
    testEnvironment: "node",
    moduleNameMapper: {
        "@src/(.*)": "<rootDir>/src/$1",
        "@test/(.*)": "<rootDir>/test/$1",
        "@config/(.*)": "<rootDir>/src/config/$1",
        "@controller/(.*)": "<rootDir>/src/controller/$1",
        "@decorator/(.*)": "<rootDir>/src/decorator/$1",
        "@entity/(.*)": "<rootDir>/src/entity/$1",
        "@enum/(.*)": "<rootDir>/src/enum/$1",
        "@error/(.*)": "<rootDir>/src/error/$1",
        "@initializer/(.*)": "<rootDir>/src/initializer/$1",
        "@interface/(.*)": "<rootDir>/src/interface/$1",
        "@migration/(.*)": "<rootDir>/src/migration/$1",
        "@route/(.*)": "<rootDir>/src/route/$1",
        "@type/(.*)": "<rootDir>/src/type/$1",
        "@util/(.*)": "<rootDir>/src/util/$1",
    },
};
