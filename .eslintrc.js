module.exports = {
  extends: "airbnb",
  env: {
    browser: true,
    jest: true,
    es6: true
  },
  parser: "babel-eslint",
  plugins: ["react"],
  rules: {
    semi: ["error", "never"],
    "comma-dangle": ["warn", "always-multiline"],
    "react/jsx-filename-extension": [1, { extensions: [".js", ".jsx"] }],
    "import/no-extraneous-dependencies": ["error", { "devDependencies": true }],
    "jsx-a11y/anchor-is-valid": ["error", {
      "components": ["Link"],
      "specialLink": ["to"]
    }]
  }
};