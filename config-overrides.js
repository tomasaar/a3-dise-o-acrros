module.exports = function override(config, env) {
  // Añade fallbacks para los módulos de Node.js que ammo.js intenta usar en el navegador.
  if (!config.resolve) {
    config.resolve = {};
  }
  if (!config.resolve.fallback) {
    config.resolve.fallback = {};
  }
  config.resolve.fallback.fs = false;
  config.resolve.fallback.path = false;
  return config;
};