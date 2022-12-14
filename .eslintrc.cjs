module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true
  },
  extends: ['standard', 'prettier'],
  overrides: [],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  plugins: ['html', 'prettier'],
  rules: {
    'prettier/prettier': 'error',
    'no-unused-vars': 1,
    camelcase: 0
  }
}
