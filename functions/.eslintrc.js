/* eslint-disable quote-props */
module.exports = {
  root: true,
  env: {
    es6: true,
    node: true,
  },
  extends: ['eslint:recommended', 'google'],
  parserOptions: {
    ecmaVersion: 2018,
  },
  rules: {
    'object-curly-spacing': ['error', 'always'],
    indent: ['error', 2],
    'quote-props': ['error', 'as-needed'],
    'max-len': 'off',
  },
};
