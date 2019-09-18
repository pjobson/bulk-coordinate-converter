import { PATTERNS } from './patterns.js';

export class DegreesDecimalMinutes {
  /**
   * Constructs DegreesDecimalMinutes Object
   *
   * @param coords - object containing lat and lng keys
   *
   * @remarks
   * This can take in machine or user input and will normalize it to a DDM object.
   *
   * @returns DegreesDecimalMinutes object containing latitude and logitude
   *
   */
  constructor(coords) {
    this.lat;
    this.lng;

    const errors = this.validate(coords);
    if (errors.length > 0) {
      throw new Error(errors);
    }
    const normalizedCoords = this.normalize(coords);
    this.lat = normalizedCoords.lat;
    this.lng = normalizedCoords.lng;

    return this;
  };

  /**
   * Validates coordinates against known good patterns
   *
   * @param coords - object containing lat and lng keys
   *
   * @returns an array
   *
   */
  validate(coords) {
    let errors = [];
    if (!PATTERNS.ddmLat.test(coords.lat)) {
      errors.push('Invalid Latitude');
    }
    if (!PATTERNS.ddmLng.test(coords.lng)) {
      errors.push('Invalid Longitude');
    }
    return errors;
  };

  /**
   * Normalizes Degree Decimal Minutes
   *
   * @param coords - object containing lat and lng keys
   *
   * @returns normalized coordinates
   *
   */
  normalize(coords) {
    const nCoords = {};
    for (let key in coords) {
      const parts = coords[key].replace(/\s/g,'').split(/[^\d\.NSEWnsew]/);
      nCoords[key] = {
        degrees: parseInt(parts[0]),
        minutes: parseFloat(parseFloat(parts[1]).toFixed(5)),
        direction: parts[2].toUpperCase()
      };
      nCoords[key].display = `${nCoords[key].degrees}° ${nCoords[key].minutes}′ ${nCoords[key].direction}`;
    }
    return nCoords;
  };

  /**
   * Converts Degrees Decimal Minutes to Universal Transverse Mercator
   *
   * @returns object containing UTM data
   *
   */
  toUTM() {
    const { lat, lng } = this.toDD();
    const utmdata = utm.fromLatLon(lat, lng);

    return {
      display    : utmdata.display,
      easting    : utmdata.easting,
      northing   : utmdata.northing,
      zoneLetter : utmdata.zoneLetter,
      zoneNum    : utmdata.zoneNum
    }
  };

  /**
   * Converts Degree Decimal Minutes to Decimal Degrees
   *
   * @returns object containing DD data
   *
   */
  toDD() {
    // ϕ = latitude
    // λ = longitude
    // S or W direction inverts degree
    const ϕinv = (this.lat.direction === 'S') ? -1 : 1;
    const ϕDD = parseFloat(((this.lat.degrees + (this.lat.minutes/60)) * ϕinv).toFixed(5));
    const λinv = (this.lng.direction === 'W') ? -1 : 1;
    const λDD = parseFloat(((this.lng.degrees + (this.lng.minutes/60)) * λinv).toFixed(5));

    const ddCoords = {
      lat: ϕDD,
      lng: λDD
    };

    return ddCoords;
  };

  /**
   * Converts to Degrees Minutes Seconds
   *
   * @returns object containing DMS data
   *
   */
  toDMS() {
    // ϕ = latitude
    // λ = longitude
    const ϕabs = Math.abs(this.toDD().lat);
    const ϕdir = this.toDD().lat<0 ? 'S' : 'N';
    const ϕdeg = Math.trunc(ϕabs);
    const ϕmin = Math.trunc((ϕabs-ϕdeg)*60);
    const ϕsec = Math.trunc((ϕabs-ϕdeg-ϕmin/60)*3600);
    const λabs = Math.abs(this.toDD().lng);
    const λdir = this.toDD().lng<0 ? 'W' : 'E';
    const λdeg = Math.trunc(λabs);
    const λmin = Math.trunc((λabs-λdeg)*60);
    const λsec = Math.trunc((λabs-λdeg-λmin/60)*3600);

    const dmsCoordSet = {
      lat: `${ϕdeg}° ${(ϕmin < 0) ? 0 : ϕmin}′ ${(ϕsec < 0) ? 0 : ϕsec}″ ${ϕdir}`,
      lng: `${λdeg}° ${(λmin < 0) ? 0 : λmin}′ ${(λsec < 0) ? 0 : λsec}″ ${λdir}`
    };
    return dmsCoordSet;
  };

  /**
   * Converts to Military Grid Reference System
   *
   * @returns string containing reference
   *
   */
  toMGRS() {
    return mgrs.forward([this.toDD().lng, this.toDD().lat], 5);
  };
};
