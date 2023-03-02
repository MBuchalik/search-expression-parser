const baseConfig = require('eslint-config-mbuchalik/.prettierrc.js');

const baseConfigPlugins = baseConfig.plugins ?? [];

module.exports = {
  ...baseConfig,

  plugins: [...baseConfigPlugins, require('prettier-plugin-tailwindcss')],
};
