'use strict'
// Modifed from TimothyGu's https://github.com/timothygu/utm

const utm = {
  K0           : 0.9996,
  E            : 0.00669438,
  E2           : null,
  E3           : null,
  E_P2         : null,
  SQRT_E       : null,
  _E           : null,
  _E2          : null,
  _E3          : null,
  _E4          : null,
  _E5          : null,
  M1           : null,
  M2           : null,
  M3           : null,
  M4           : null,
  P2           : null,
  P3           : null,
  P4           : null,
  P5           : null,
  R            : 6378137,
  ZONE_LETTERS : 'CDEFGHJKLMNPQRSTUVWXX',
  initVars: () => {
    utm.E2     = Math.pow(utm.E, 2);
    utm.E3     = Math.pow(utm.E, 3);
    utm.E_P2   = utm.E / (1 - utm.E);
    utm.SQRT_E = Math.sqrt(1 - utm.E);
    utm._E     = (1 - utm.SQRT_E) / (1 + utm.SQRT_E);
    utm._E2    = Math.pow(utm._E, 2);
    utm._E3    = Math.pow(utm._E, 3);
    utm._E4    = Math.pow(utm._E, 4);
    utm._E5    = Math.pow(utm._E, 5);
    utm.M1     = 1 - utm.E  / 4 - 3 * utm.E2 / 64 -  5 * utm.E3 /  256;
    utm.M2     = 3 * utm.E  / 8 + 3 * utm.E2 / 32 + 45 * utm.E3 / 1024;
    utm.M3     = 15 * utm.E2 /  256 + 45 * utm.E3 / 1024;
    utm.M4     = 35 * utm.E3 / 3072;
    utm.P2     = 3 /   2 * utm._E  -  27 /  32 * utm._E3 + 269 / 512 * utm._E5;
    utm.P3     =   21 /  16 * utm._E2 -  55 /  32 * utm._E4;
    utm.P4     =  151 /  96 * utm._E3 - 417 / 128 * utm._E5;
    utm.P5     = 1097 / 512 * utm._E4;
  },
  // UTM to Latitude / Longitude
  toLatLon: (easting, northing, zoneNum, zoneLetter, northern, strict) => {
    strict = strict !== undefined ? strict : true;

    if (!zoneLetter && northern === undefined) {
      throw new Error('either zoneLetter or northern needs to be set');
    } else if (zoneLetter && northern !== undefined) {
      throw new Error('set either zoneLetter or northern, but not both');
    }

    if (strict) {
      if (easting < 100000 || 1000000 <= easting) {
        throw new RangeError('easting out of range (must be between 100 000 m and 999 999 m)');
      }
      if (northing < 0 || northing > 10000000) {
        throw new RangeError('northing out of range (must be between 0 m and 10 000 000 m)');
      }
    }
    if (zoneNum < 1 || zoneNum > 60) {
      throw new RangeError('zone number out of range (must be between 1 and 60)');
    }
    if (zoneLetter) {
      zoneLetter = zoneLetter.toUpperCase();
      if (zoneLetter.length !== 1 || utm.ZONE_LETTERS.indexOf(zoneLetter) === -1) {
        throw new RangeError('zone letter out of range (must be between C and X)');
      }
      northern = zoneLetter >= 'N';
    }

    const x = easting - 500000;
    const y = northing;

    if (!northern) y -= 1e7;

    const m = y / utm.K0;
    const mu = m / (utm.R * utm.M1);

    const pRad = mu +
                 utm.P2 * Math.sin(2 * mu) +
                 utm.P3 * Math.sin(4 * mu) +
                 utm.P4 * Math.sin(6 * mu) +
                 utm.P5 * Math.sin(8 * mu);

    const pSin  = Math.sin(pRad);
    const pSin2 = Math.pow(pSin, 2);

    const pCos = Math.cos(pRad);

    const pTan  = Math.tan(pRad);
    const pTan2 = Math.pow(pTan, 2);
    const pTan4 = Math.pow(pTan, 4);

    const epSin     = 1 - utm.E * pSin2;
    const epSinSqrt = Math.sqrt(epSin);

    const n = utm.R / epSinSqrt;
    const r = (1 - utm.E) / epSin;

    const c  = utm._E * pCos * pCos;
    const c2 = c * c;

    const d  = x / (n * utm.K0);
    const d2 = Math.pow(d, 2);
    const d3 = Math.pow(d, 3);
    const d4 = Math.pow(d, 4);
    const d5 = Math.pow(d, 5);
    const d6 = Math.pow(d, 6);

    const latitude = pRad - (pTan / r) *
                    (d2 / 2 -
                     d4 / 24 *
                     (5 + 3 * pTan2 + 10 * c - 4 * c2 - 9 * utm.E_P2)) +
                     d6 / 720 *
                     (61 + 90 * pTan2 + 298 * c + 45 * pTan4 - 252 * utm.E_P2 - 3 * c2);
    const longitude = (d -
                       d3 / 6 *
                       (1 + 2 * pTan2 + c) +
                       d5 / 120 *
                       (5 - 2 * c + 28 * pTan2 - 3 * c2 + 8 * utm.E_P2 + 24 * pTan4)) / pCos;

    return {
      latitude:  utm.toDegrees(latitude),
      longitude: utm.toDegrees(longitude) + utm.zoneNumberToCentralLongitude(zoneNum)
    };
  },
  // Latitude / Longitude to UTM
  fromLatLon: (latitude, longitude, forceZoneNum) => {
    if (latitude > 84 || latitude < -80) {
      throw new RangeError('latitude out of range (must be between 80 deg S and 84 deg N)');
    }
    if (longitude > 180 || longitude < -180) {
      throw new RangeError('longitude out of range (must be between 180 deg W and 180 deg E)');
    }

    const latRad = utm.toRadians(latitude);
    const latSin = Math.sin(latRad);
    const latCos = Math.cos(latRad);

    const latTan  = Math.tan(latRad);
    const latTan2 = Math.pow(latTan, 2);
    const latTan4 = Math.pow(latTan, 4);

    let zoneNum;

    if (forceZoneNum === undefined) {
      zoneNum = utm.latLonToZoneNumber(latitude, longitude);
    } else {
      zoneNum = forceZoneNum;
    }

    const zoneLetter = utm.latitudeToZoneLetter(latitude);

    const lonRad        = utm.toRadians(longitude);
    const centralLon    = utm.zoneNumberToCentralLongitude(zoneNum);
    const centralLonRad = utm.toRadians(centralLon);

    const n = utm.R / Math.sqrt(1 - utm.E * latSin * latSin);
    const c = utm.E_P2 * latCos * latCos;

    const a  = latCos * (lonRad - centralLonRad);
    const a2 = Math.pow(a, 2);
    const a3 = Math.pow(a, 3);
    const a4 = Math.pow(a, 4);
    const a5 = Math.pow(a, 5);
    const a6 = Math.pow(a, 6);

    const m = utm.R * (utm.M1 * latRad -
                   utm.M2 * Math.sin(2 * latRad) +
                   utm.M3 * Math.sin(4 * latRad) -
                   utm.M4 * Math.sin(6 * latRad));
    const easting = utm.K0 * n *
                    (a +
                     a3 / 6 * (1 - latTan2 + c) +
                     a5 / 120 * (5 - 18 * latTan2 + latTan4 + 72 * c - 58 * utm.E_P2)) + 500000;
    const northing = utm.K0 *
                     (m + n * latTan *
                     (a2 / 2 +
                      a4 / 24 * (5 - latTan2 + 9 * c + 4 * c * c) +
                      a6 / 720 * (61 - 58 * latTan2 + latTan4 + 600 * c - 330 * utm.E_P2)));
    if (latitude < 0) northing += 1e7;

    return {
      easting: easting,
      northing: northing,
      zoneNum: zoneNum,
      zoneLetter: zoneLetter,
      display: `${zoneNum}${zoneLetter} ${parseFloat(easting.toFixed(2))} ${parseFloat(northing.toFixed(2))}`
    };
  },
  // Latitude to Zone Letter
  latitudeToZoneLetter: latitude => {
    if (-80 <= latitude && latitude <= 84) {
      return utm.ZONE_LETTERS[Math.floor((latitude + 80) / 8)];
    } else {
      return null;
    }
  },
  // Latitude / Longitude to Zone Number
  latLonToZoneNumber: (latitude, longitude) => {
    if (56 <= latitude && latitude < 64 && 3 <= longitude && longitude < 12) return 32;

    if (72 <= latitude && latitude <= 84 && longitude >= 0) {
      if (longitude <  9) return 31;
      if (longitude < 21) return 33;
      if (longitude < 33) return 35;
      if (longitude < 42) return 37;
    }

    return Math.floor((longitude + 180) / 6) + 1;
  },
  // Zone Number ot Central Latitude
  zoneNumberToCentralLongitude: zoneNum => {
    return (zoneNum - 1) * 6 - 180 + 3;
  },
  // Radians to Degrees
  toDegrees: rad => {
    return rad / Math.PI * 180;
  },
  // Degrees to Radians
  toRadians: deg => {
    return deg * Math.PI / 180;
  }
};
utm.initVars();

