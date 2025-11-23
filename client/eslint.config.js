import js from '@eslint/js'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import react from 'eslint-plugin-react'
import globals from 'globals'

export default [
  { ignores: ['dist'] },
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      react,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      'max-depth': ['error', 5],
      'react/jsx-key': 'warn',
      complexity: ['error', 10],
      'max-lines': [
        'error',
        { max: 200, skipBlankLines: true, skipComments: true },
      ],
      'no-await-in-loop': 'error',
      'arrow-body-style': ['error', 'as-needed'],
      'for-direction': 'error',
      quotes: ['error', 'single'], // ковычки
      'jsx-quotes': ['error', 'prefer-double'], // ковычки jsx
      semi: ['error', 'never'], // точка с запятой
      // 'no-console': ['warn'],
      'no-duplicate-imports': 'error', // дублирование импортов
      'object-shorthand': ['error', 'always'], // краткие записи { foo } <- { foo: foo }
      'prefer-const': 'error', // использовать const если переменная не меняется
      'no-var': 'error', // не использовать var
      'no-unused-vars': ['warn', { varsIgnorePattern: '^[A-Z_]' }],
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
    },
  },
]
