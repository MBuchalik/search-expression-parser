module.exports = {
  root: true,
  parserOptions: {
    project: './tsconfig.json',
    sourceType: 'module',
    ecmaVersion: 2022,
    tsconfigRootDir: __dirname,
  },

  // Ignore all folders except for '/src'.
  ignorePatterns: ['/*', '!/src'],

  overrides: [
    {
      files: ['*.ts'],
      extends: ['eslint-config-mbuchalik'],
    },
  ],
};
