const maxmind = require('maxmind');

let lookup;

async function init(dbPath) {
  lookup = await maxmind.open(dbPath);
}

function getGeo(ip) {
  if (!lookup) throw new Error('GeoIP database not loaded');
  return lookup.get(ip);
}

module.exports = { init, getGeo };