module.exports = function correctSpec(spec) {
  const newSpec = { ...spec };

  // correct preserve path prefix
  // as doctl apps get doesn't persist these values 🐞
  newSpec.services.forEach(service => {
    if (['optimizer', 'blog'].includes(service.name)) {
      service.routes[0].preserve_path_prefix = true
    }
  });

  return newSpec;
}
