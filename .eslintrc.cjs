/* eslint-env node */

module.exports = {
    root: true,
    env: { browser: true, es2020: true },
    extends: [
      'eslint:recommended',
      // 'plugin:@typescript-eslint/recommended',
      // 'plugin:@typescript-eslint/recommended-requiring-type-checking',
      "plugin:prettier/recommended",
    ],
    // parser: '@typescript-eslint/parser',
    parserOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      project: true,
      // tsconfigRootDir: __dirname,
    },
    rules: {
      // '@typescript-eslint/no-non-null-assertion': 'off',
    },
  }