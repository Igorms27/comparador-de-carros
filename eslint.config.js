// eslint.config.js
import tseslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import angularPlugin from 'eslint-plugin-angular';
import importPlugin from 'eslint-plugin-import';
import prettierPlugin from 'eslint-plugin-prettier';

export default [
  // Pasta node_modules e arquivos ignorados
  {
    ignores: ['node_modules/**', 'dist/**', 'coverage/**', '*.json', '*.html', 'angular.json'],
  },
  // Configurações para arquivos TypeScript
  {
    files: ['**/*.ts'],
    plugins: {
      '@typescript-eslint': tseslint,
      angular: angularPlugin,
      import: importPlugin,
      prettier: prettierPlugin,
    },
    languageOptions: {
      parser: tsParser,
      ecmaVersion: 2022,
      sourceType: 'module',
    },
    rules: {
      // TypeScript
      '@typescript-eslint/explicit-function-return-type': [
        'warn',
        {
          allowExpressions: true,
          allowTypedFunctionExpressions: true,
        },
      ],
      '@typescript-eslint/explicit-member-accessibility': [
        'warn',
        {
          accessibility: 'explicit',
          overrides: {
            accessors: 'explicit',
            constructors: 'no-public',
            methods: 'explicit',
            properties: 'explicit',
            parameterProperties: 'explicit',
          },
        },
      ],
      '@typescript-eslint/no-explicit-any': 'warn',

      // Import
      'import/order': [
        'warn',
        {
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
          groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
          'newlines-between': 'always',
          pathGroups: [
            {
              pattern: '@angular/**',
              group: 'external',
              position: 'before',
            },
          ],
          pathGroupsExcludedImportTypes: ['@angular/**'],
        },
      ],

      // JavaScript
      'no-console': [
        'warn',
        {
          allow: ['warn', 'error'],
        },
      ],
      'no-debugger': 'warn',
      'no-multiple-empty-lines': [
        'warn',
        {
          max: 1,
        },
      ],

      // Angular
      'angular/controller-as': 'off',
      'angular/controller-as-route': 'off',
      'angular/controller-as-vm': 'off',
      'angular/module-getter': 'off',
      'angular/no-service-method': 'off',
      'angular/prefer-component-over-controller': 'off',
    },
  },
];
