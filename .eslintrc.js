module.exports = {
    parser: "@typescript-eslint/parser",
    plugins: ["@typescript-eslint", "jest"],
    extends: [
        "eslint:recommended",
        "plugin:@typescript-eslint/eslint-recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:@typescript-eslint/recommended-requiring-type-checking",
        "plugin:jest/recommended",
    ],
    parserOptions: {
        ecmaVersion: 2020,
        project: "./tsconfig.json",
    },
};
