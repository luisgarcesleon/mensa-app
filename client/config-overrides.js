const ModuleScopePlugin = require('react-dev-utils/ModuleScopePlugin');
const rewireReactHotLoader = require("react-app-rewire-hot-loader");

module.exports = function override(config, env) {
     config.resolve.plugins = config.resolve.plugins.filter(plugin => !(plugin instanceof ModuleScopePlugin));
     config = rewireReactHotLoader(config, env);
     return config;
};