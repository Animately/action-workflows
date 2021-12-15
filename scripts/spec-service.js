/**
 * -------------------------------------------
 * Replace spec data for specified service
 *
 * @usage
 *   node scripts/spec-service.js <service> <spec-file> <replace-file>
 *
 * @example
 *   node scripts/spec-service.js optimizer app-spec.json service-spec.json
 *
 * -------------------------------------------
 */

const fs = require('fs');
const correctSpec = require('./spec-correct');

const serviceName = process.argv[2];
const specFile = JSON.parse(fs.readFileSync(process.argv[3], 'utf8'));
const replFile = JSON.parse(fs.readFileSync(process.argv[4], 'utf8'));

let spec = correctSpec(specFile);

spec.services = spec.services.map(service => {
  return (service.name === serviceName)
    ? { ...service, ...replFile }
    : service
})

console.log(JSON.stringify(spec, null, 2));
