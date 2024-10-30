// @ts-check
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
    eslint.configs.recommended,
    ...tseslint.configs.strict,
    ...tseslint.configs.stylistic,
    {
        plugins: {
            '@typescript-eslint': tseslint.plugin,
        },
        languageOptions: {
            parser: tseslint.parser,
            parserOptions: {
                projectService: true,
                tsconfigRootDir: import.meta.dirname,
            },
        },
        files: ['**/*.ts', '**/*.tsx'],
        rules: {
            '@typescript-eslint/no-explicit-any': 0,
            'indent': ['error', 4, { 'SwitchCase': 1 }],
            'linebreak-style': ['error', 'unix'],
            'quotes': ['error', 'single'],
            'comma-dangle': ['error', 'always-multiline'],
            'semi': ['error', 'always'],
            'space-before-function-paren': ['error', 'never'],
            'keyword-spacing': ['error', { 'before': true, 'after': true }],
            'no-multiple-empty-lines': ['error', { 'max': 1, 'maxEOF': 1 }],
        },
    },
    {
        ignores: ['**/build/**', '**/dist/**', './frontend/.next/**', './backend/index.cjs']
    },
    {
        // disable type-aware linting on JS files
        files: ['**/*.cjs'],
        ...tseslint.configs.disableTypeChecked,
    }
);
