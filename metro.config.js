const { getDefaultConfig } = require('@expo/metro-config');

const defaultConfig = getDefaultConfig(__dirname);

// Ensure 'cjs' is included in the extensions list
defaultConfig.resolver.sourceExts = [...defaultConfig.resolver.sourceExts, 'cjs'];

// Disable unstable package exports (if needed)
defaultConfig.resolver.unstable_enablePackageExports = false;

module.exports = defaultConfig;
