import js from '@eslint/js'
import globals from 'globals'

export default [
  { ignores: ['dist'] },
  {
    files: ['**/*.{js}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    plugins: {},
    rules: {
      ...js.configs.recommended.rules,
      'max-depth': ['error', 5],
      complexity: ['error', 10],
      'max-lines': [
        'error',
        { max: 200, skipBlankLines: true, skipComments: true },
      ],
      'no-await-in-loop': 'error',
      'arrow-body-style': ['error', 'as-needed'],
      'for-direction': 'error',
      quotes: ['error', 'single'], // ковычки
      semi: ['error', 'never'], // точка с запятой
      // 'no-console': ['warn'],
      eqeqeq: ['error', 'always'], // ===
      'no-duplicate-imports': 'error', // дублирование импортов
      'object-shorthand': ['error', 'always'], // краткие записи { foo } <- { foo: foo }
      'prefer-const': 'error', // использовать const если переменная не меняется
      'no-var': 'error', // не использовать var
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
    },
  },
]
