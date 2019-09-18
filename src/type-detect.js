import { PATTERNS } from './patterns.js';

const isDD = (lat, lng) => {
  return (PATTERNS.ddLat.test(lat) && PATTERNS.ddLng.test(lng));
}

const isDDM = (lat, lng) => {
  return (PATTERNS.ddmLat.test(lat) && PATTERNS.ddmLng.test(lng));
}

const isDMS = (lat, lng) => {
  return (PATTERNS.dmsLat.test(lat) && PATTERNS.dmsLng.test(lng));
}

const isMGRS = (coord) => {
  return (PATTERNS.mgrs.test(coord));
}

const isUTM = (coord) => {
  return (PATTERNS.utm.test(coord));
}

export function discernType(coordA='', coordB='') {
  if (isDD(coordA, coordB) ) { return 'DD' ;  }
  if (isDMS(coordA, coordB)) { return 'DMS';  }
  if (isDDM(coordA, coordB)) { return 'DDM';  }
  if (isMGRS(coordA))        { return 'MGRS'; }
  if (isUTM(coordA))         { return 'UTM';  }
  return 'INVALID';
}
