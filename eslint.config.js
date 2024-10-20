const parser = require('@typescript-eslint/parser');
const eslintPlugin = require('@typescript-eslint/eslint-plugin');

module.exports = {
    languageOptions: {
        parser: parser,
        ecmaVersion: 6,
        sourceType: 'module'
    },
    plugins: {
        '@typescript-eslint': eslintPlugin,
    },
    files: ["src/**/*.ts"],
    ignores: [
        'node_modules',
        'build',
        'src/formatter/bin',
        'tmp',
    ],
    rules: {
        'no-console': 'warn',
        'curly': 'warn',
        'eqeqeq': 'warn',
        'no-throw-literal': 'warn',
        'semi': 'warn',
        'max-len': [
            'warn',
            {
              code: 120
            }
        ]
    }
};