import { PATTERNS } from './patterns.js';

export class DecimalDegrees {
  /**
   * Constructs DecimalDegrees Object
   *
   * @param coords - object containing lat and lng keys
   *
   * @remarks
   * This can take in machine or user input and will normalize it to floating point numbers.
   *
   * @returns DecimalDegrees object containing latitude and logitude
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
    if (!PATTERNS.ddLat.test(coords.lat)) {
      errors.push('Invalid Latitude');
    }
    if (!PATTERNS.ddLng.test(coords.lng)) {
      errors.push('Invalid Longitude');
    }
    return errors;
  };

  /**
   * Normalizes Decimal Degrees
   *
   * @param coords - object containing lat and lng keys
   *
   * @returns normalized coordinates
   *
   */
  normalize(coords) {
    const nCoords = {};
    for (let key in coords) {
      // If South or West direction, the result should be inverted.
      const invert = /[SsWw]/.test(coords[key]) ? -1 : 1;
      nCoords[key] = parseFloat(String(coords[key]).replace(/[^\d\.-]+/g,'')) * invert;
    }
    return nCoords;
  }

  /**
   * Converts Decimal Degrees to Universal Transverse Mercator
   *
   * @returns object containing UTM data
   *
   */
  toUTM() {
    const { lat, lng } = this;
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
   * Converts Decimal Degrees to Degree Minute Second
   *
   * @returns object containing DMS data
   *
   */
  toDMS() {
    // ϕ = latitude
    // λ = longitude
    const ϕabs = Math.abs(this.lat);
    const ϕdir = this.lat<0 ? 'S' : 'N';
    const ϕdeg = Math.trunc(ϕabs);
    const ϕmin = Math.trunc((ϕabs-ϕdeg)*60);
    const ϕsec = Math.trunc((ϕabs-ϕdeg-ϕmin/60)*3600);
    const λabs = Math.abs(this.lng);
    const λdir = this.lng<0 ? 'W' : 'E';
    const λdeg = Math.trunc(λabs);
    const λmin = Math.trunc((λabs-λdeg)*60);
    const λsec = Math.trunc((λabs-λdeg-λmin/60)*3600);

    const dmsCoordSet = {
      lat: `${ϕdeg}° ${(ϕmin < 0) ? 0 : ϕmin}′ ${(ϕsec < 0) ? 0 : ϕsec}″ ${ϕdir}`,
      lng: `${λdeg}° ${(λmin < 0) ? 0 : λmin}′ ${(λsec < 0) ? 0 : λsec}″ ${λdir}`
    };
    return dmsCoordSet;
  }

  /**
   * Converts Decimal Degrees to Degree Decimal Minutes
   *
   * @returns object containing DDM data
   *
   */
  toDDM() {
    // ϕ = latitude
    // λ = longitude
    const ϕabs = Math.abs(this.lat);
    const ϕdir = this.lat<0 ? 'S' : 'N';
    const ϕdeg = Math.trunc(ϕabs);
    const ϕmin = parseFloat(parseFloat(`${(ϕabs-ϕdeg)*60}`).toFixed(5));
    const λabs = Math.abs(this.lng);
    const λdir = this.lng<0 ? 'W' : 'E';
    const λdeg = Math.trunc(λabs);
    const λmin = parseFloat(parseFloat(`${(λabs-λdeg)*60}`).toFixed(5));

    const ddmCoordSet = {
      lat: `${ϕdeg}° ${(ϕmin<0) ? 0 : ϕmin}′ ${ϕdir}`,
      lng: `${λdeg}° ${(λmin<0) ? 0 : λmin}′ ${λdir}`
    };
    return ddmCoordSet;
  }

  /**
   * Converts Decimal Degrees to Military Grid Reference System
   *
   * @returns string containing MGRS data
   *
   */
  toMGRS() {
    return mgrs.forward([this.lng, this.lat], 5);
  }
};
