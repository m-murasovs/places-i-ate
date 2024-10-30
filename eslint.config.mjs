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
            '@typescript-eslint/no-unsafe-argument': 'error',
            '@typescript-eslint/no-unsafe-assignment': 'error',
            '@typescript-eslint/no-unsafe-call': 'error',
            '@typescript-eslint/no-unsafe-member-access': 'error',
            '@typescript-eslint/no-unsafe-return': 'error',
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
        ignores: ['**/build/**', '**/dist/**', 'frontend/.next/**']
    },
    {
        // disable type-aware linting on JS files
        files: ['**/*.js'],
        ...tseslint.configs.disableTypeChecked,
    }
);
