module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:prettier/recommended', // Enables and configures the Prettier plugin
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
    // You can add custom ESLint rules here if you want
    // e.g., "no-unused-vars": "warn"
    'no-unused-vars': 'warn', // Warn about unused variables
    'no-console': 'off', // Allow console statements
    'prettier/prettier': [
      'error',
      {
        semi: false,
        singleQuote: true,
        printWidth: 80,
        // trailingComma: 'es5', // Uncomment if you want to enforce trailing commas
        // arrowParens: 'avoid', // Uncomment if you want to avoid parentheses around single arrow function parameters
      },
    ],
  },
}
