/**
 * -------------------------------------------
 * Replace parts of the spec file
 *
 * @usage
 *   node scripts/spec.js <spec-file> <replace-file>
 *
 * @example
 *   node scripts/spec.js app-spec.json replace-app-spec.json
 * -------------------------------------------
 */

const fs = require('fs');
const correctSpec = require('./spec-correct');

const specFile = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
const replFile = JSON.parse(fs.readFileSync(process.argv[3], 'utf8'));

console.log(
  JSON.stringify({...correctSpec(specFile), ...replFile}, null, 2)
);
