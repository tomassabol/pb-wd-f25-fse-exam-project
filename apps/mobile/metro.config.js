const { withNativeWind } = require("nativewind/metro");
const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

module.exports = module.exports = withNativeWind(config, {
  input: "./styles/globals.css",
});
