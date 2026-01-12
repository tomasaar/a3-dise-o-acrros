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

  // Evitar warning de source-map-loader para @mediapipe/tasks-vision faltante
  try {
    const mediapipeExclude = /[\\/]node_modules[\\/]@react-three[\\/]drei[\\/]node_modules[\\/]@mediapipe[\\/]tasks-vision/;

    const applyExclude = (rule) => {
      if (!rule) return;
      // regla directa
      if (rule.loader && rule.loader.includes('source-map-loader')) {
        rule.exclude = rule.exclude ? [rule.exclude, mediapipeExclude] : mediapipeExclude;
      }
      // regla en use
      if (rule.use) {
        const uses = Array.isArray(rule.use) ? rule.use : [rule.use];
        uses.forEach(u => {
          if (u && u.loader && u.loader.includes('source-map-loader')) {
            rule.exclude = rule.exclude ? [rule.exclude, mediapipeExclude] : mediapipeExclude;
          }
        });
      }
      // reglas anidadas
      if (rule.oneOf && Array.isArray(rule.oneOf)) {
        rule.oneOf.forEach(inner => applyExclude(inner));
      }
    };

    if (config.module && Array.isArray(config.module.rules)) {
      config.module.rules.forEach(rule => applyExclude(rule));
    }
  } catch (e) {
    // no hacemos nada si el formato de config cambia
  }
  return config;
};