module.exports = {
  plugins: ['@typescript-eslint/eslint-plugin'],
  extends: ['@react-native-community', 'eslint-config-prettier'],
  parser: '@babel/eslint-parser',
  rules: {
    'react-native/no-inline-styles': 0,
    'react/react-in-jsx-scope': 'off',
    'react/jsx-filename-extension': [
      1,
      {extensions: ['.js', '.jsx', '.ts', '.tsx']},
    ],
    'prettier/prettier': [
      'error',
      {
        endOfLine: 'auto',
      },
    ],
    '@typescript-eslint/no-unused-vars': [
      'warn',
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        caughtErrorsIgnorePattern: '^_',
        ignoreRestSiblings: true,
      },
    ],
    // 'no-console': ['error', { allow: ['debug'] }],
  },
};
