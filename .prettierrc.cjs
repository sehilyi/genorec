/**
 * @type {import('prettier').Config}
 */
module.exports = {
  "overrides": [
    {
      "files": "*",
      "options": {
        "printWidth": 120,
        "tabWidth": 4,
        "singleQuote": true,
        "bracketSpacing": true,
        "arrowParens": "avoid",
        "trailingComma": "none",
        "proseWrap": "never"
      }
    }
  ]
}