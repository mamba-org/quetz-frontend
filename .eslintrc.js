module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:jsdoc/recommended',
    'plugin:prettier/recommended',
    'plugin:react/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.eslint.json',
    sourceType: 'module',
    ecmaVersion: 2017,
  },
  plugins: ['@typescript-eslint', 'jsdoc'],
  rules: {
    '@typescript-eslint/naming-convention': [
      'error',
      {
        selector: 'interface',
        format: ['PascalCase'],
        custom: {
          regex: '^I[A-Z]',
          match: true,
        },
      },
    ],
    '@typescript-eslint/ban-ts-comment': ['warn', { 'ts-ignore': true }],
    '@typescript-eslint/no-unused-vars': ['warn', { args: 'none' }],
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/camelcase': 'off',
    '@typescript-eslint/no-namespace': 'off',
    '@typescript-eslint/no-use-before-define': 'off',
    '@typescript-eslint/quotes': [
      'error',
      'single',
      { avoidEscape: true, allowTemplateLiterals: false },
    ],
    curly: ['error', 'all'],
    'jsdoc/require-param-type': 'off',
    'jsdoc/require-property-type': 'off',
    'jsdoc/require-returns-type': 'off',
    'jsdoc/require-returns': 'off',
    'jsdoc/no-types': 'warn',
    'prefer-arrow-callback': 'error',
  },
  settings: {
    jsdoc: {
      mode: 'typescript',
    },
    react: {
      version: 'detect',
    },
  },
};
