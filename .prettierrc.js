/**
 * Prettier configuration
 * @see https://prettier.io/docs/en/options.html
 */
export default {
  // 2 spaces indent
  tabWidth: 2,
  useTabs: false,

  // Single quotes
  singleQuote: true,

  // Semicolon at end of statements
  semi: true,

  // Trailing commas
  trailingComma: 'all',

  // 100 characters per line
  printWidth: 100,

  // LF line endings (for Unix/Linux/macOS)
  endOfLine: 'lf',

  // Quote props only when needed
  quoteProps: 'as-needed',

  // Bracket spacing
  bracketSpacing: true,

  // Arrow function parentheses
  arrowParens: 'always',

  // Vue SFC script/style blocks indentation
  vueIndentScriptAndStyle: false
}
