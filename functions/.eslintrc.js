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
    indent: ['error', 'always'],
  },
};
