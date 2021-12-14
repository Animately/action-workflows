/**
 * -------------------------------------------
 * Replace spec env vars for a specified service
 *
 * @usage
 *   1. Create app-spec.json via doctl apps get <id> --format json > app-spec.json
 *   2. Create variables.json based on env vars, example:
 *      {
 *        "SUPER_SECRET": {
 *          "value": "super-secret-value",
 *          "type": "SECRET"
 *        },
 *        "BASE_PATH": {
 *          "value": "/var/www/html",
 *          "type": "GENERAL"
 *        }
 *      }
 *   3. Run this replacer
 *      node replace-spec.js <service-name>
 * -------------------------------------------
 */

const variables = require('./variables.json');
const serviceName = process.argv[2];

let spec = require('./app-spec.json');

spec.services = spec.services.map(service => {
  // correct preserve path prefix
  // as DO doesn't persist these values
  if (['optimizer', 'blog'].includes(service.name)) {
    service.routes[0].preserve_path_prefix = true
  }

  if (service.name === serviceName) {
    service.envs = Object.keys(variables).map(key => ({
      key,
      value: variables[key].value,
      type: variables[key].type,
      scope: 'RUN_TIME',
    }))
  }

  return service;
})

console.log(JSON.stringify(spec, null, 2));
