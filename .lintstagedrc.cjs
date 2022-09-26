module.exports = {
  '**/*.html': 'eslint --fix --cache',
  '**/*.{js,ts,cjs}': 'eslint --fix --cache',
  '__tests__/*.spec.{js,ts}': 'eslint --fix --cache'
}
