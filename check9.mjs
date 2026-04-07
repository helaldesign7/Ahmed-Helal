import fs from 'fs';
const data = JSON.parse(fs.readFileSync('schema.json', 'utf8'));

// Find leads any way possible
function findKeys(obj, path = '') {
  if (typeof obj !== 'object' || obj === null) return [];
  let found = [];
  for (let k in obj) {
    if (k === 'leads') {
      found.push(path + '.' + k);
    } else {
      found = found.concat(findKeys(obj[k], path + '.' + k));
    }
  }
  return found;
}
const paths = findKeys(data);
console.log('Found leads at paths:', paths);

const leadsSchema = data.definitions ? data.definitions.leads : undefined;
if (leadsSchema && leadsSchema.properties) {
  console.log('Columns:', Object.keys(leadsSchema.properties));
} else {
  // If not in definitions, where is it? Let's check pathways
  const leadsPath = data.paths['/leads'];
  if (leadsPath && leadsPath.get && leadsPath.get.responses['200'].schema) {
    console.log('Found via GET');
    // ...
  }
}
