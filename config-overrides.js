const path = require('path');

const projectRoots = [
  path.resolve(__dirname, 'src'),
  path.resolve(__dirname, 'shop'),
  path.resolve(__dirname, 'services'),
  path.resolve(__dirname, 'shipping'),
];

module.exports = function override(config) {
  config.resolve.plugins = config.resolve.plugins.filter(
    (plugin) => plugin.constructor.name !== 'ModuleScopePlugin'
  );

  config.resolve.alias = {
    ...config.resolve.alias,
    shop: path.resolve(__dirname, 'shop'),
    services: path.resolve(__dirname, 'services'),
    shipping: path.resolve(__dirname, 'shipping'),
  };

  config.resolve.extensions = [
    '.tsx',
    '.ts',
    '.jsx',
    '.js',
    ...config.resolve.extensions.filter(
      (ext) => !['.tsx', '.ts', '.jsx', '.js'].includes(ext)
    ),
  ];

  const oneOfRule = config.module.rules.find((rule) => rule.oneOf);
  if (oneOfRule) {
    oneOfRule.oneOf.forEach((rule) => {
      if (!rule.include || !rule.test) return;

      const test = rule.test.toString();
      const isSourceRule =
        test.includes('tsx') ||
        test.includes('ts') ||
        test.includes('jsx') ||
        test.includes('js');

      if (isSourceRule) {
        rule.include = projectRoots;
      }
    });
  }

  return config;
};
