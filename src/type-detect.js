import { PATTERNS } from './patterns.js';

function isDD(lat, lng) {
  return (PATTERNS.ddLat.test(lat) && PATTERNS.ddLng.test(lng));
}

function isDDM(lat, lng) {
  return (PATTERNS.ddmLat.test(lat) && PATTERNS.ddmLng.test(lng));
}

function isDMS(lat, lng) {
  return (PATTERNS.dmsLat.test(lat) && PATTERNS.dmsLng.test(lng));
}

function isMGRS(coord) {
  return (PATTERNS.mgrs.test(coord));
}

export function discernType(coordA='', coordB='') {
  if (isDD(coordA, coordB) ) { return 'DD' ; }
  if (isDMS(coordA, coordB)) { return 'DMS'; }
  if (isDDM(coordA, coordB)) { return 'DDM'; }
  if (isMGRS(coordA)) { return 'MGRS'; }
  return 'INVALID';
}
