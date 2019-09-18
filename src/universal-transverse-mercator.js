import { PATTERNS } from './patterns.js';

/*
 *
 * Universal Transverse Mercator Class
 * Defines UTM object and functions related.
 *
 */
export class UniversalTransverseMercator {
  /**
   * Constructs UniversalTransverseMercator Object
   *
   * @param coords - object containing lat and lng keys
   *
   * @remarks
   * This can take in machine or user input and will normalize it to a DDM object.
   *
   * @returns UniversalTransverseMercator object containing mercator
   *
   */
  constructor(reference) {
    reference = reference.display || reference;
    const errors = this.validate(reference);
    if (errors.length > 0) {
      throw new Error(errors);
    }
    // ${zoneNum}${zoneLetter} ${easting} ${northing}
    const utm       = this.normalize(reference);
    this.display    = utm;
    this.easting    = utm.split(' ')[1];
    this.northing   = utm.split(' ')[2];
    this.zoneLetter = utm.split(' ')[0].match(/[C-X]/)[0];
    this.zoneNum    = utm.split(' ')[0].match(/^\d+/)[0];
    return this;
  };

  /**
   * Validates reference against known good pattern
   *
   * @param coords - reference string
   *
   * @returns an array
   *
   */
  validate(reference) {
    let errors = [];
    if (!PATTERNS.utm.test(reference)) {
      errors.push('Invalid Universal Transverse Mercator');
    }
    return errors;
  }

  /**
   * Normalizes Universal Transverse Mercator
   *
   * @param coords - reference string
   *
   * @returns normalized reference
   *
   */
  normalize(reference) {
    const utm = reference.toUpperCase();
    return utm;
  }

  /**
   * Converts to Decimal Degrees
   *
   * @returns object containing DD data
   *
   */
  toDD() {
    const { latitude, longitude } = utm.toLatLon(this.easting, this.northing, this.zoneNum, this.zoneLetter);

    return {
      lat: parseFloat(latitude.toFixed(5)),
      lng: parseFloat(longitude.toFixed(5))
    }
  };

  /**
   * Converts to Military Grid Reference System
   *
   * @returns string containing MGRS data
   *
   */
  toMGRS() {
    const { lat, lng } = this.toDD();
    return mgrs.forward([lng, lat], 5);
  }

  /**
   * Converts to Degree Decimal Minutes
   *
   * @returns object containing DDM data
   *
   */
  toDDM() {
    const { lat, lng } = this.toDD();
    // ϕ = latitude
    // λ = longitude
    const ϕabs = Math.abs(lat);
    const ϕdir = lat<0 ? 'S' : 'N';
    const ϕdeg = Math.trunc(ϕabs);
    const ϕmin = parseFloat(parseFloat(`${(ϕabs-ϕdeg)*60}`).toFixed(5));
    const λabs = Math.abs(lng);
    const λdir = lng<0 ? 'W' : 'E';
    const λdeg = Math.trunc(λabs);
    const λmin = parseFloat(parseFloat(`${(λabs-λdeg)*60}`).toFixed(5));

    const ddmCoordSet = {
      lat: `${ϕdeg}° ${(ϕmin<0) ? 0 : ϕmin}′ ${ϕdir}`,
      lng: `${λdeg}° ${(λmin<0) ? 0 : λmin}′ ${λdir}`
    };
    return ddmCoordSet;
  }


  /**
   * Converts Decimal Degrees to Degree Minute Second
   *
   * @returns object containing DMS data
   *
   */
  toDMS() {
    const { lat, lng } = this.toDD();
    // ϕ = latitude
    // λ = longitude
    const ϕabs = Math.abs(lat);
    const ϕdir = lat<0 ? 'S' : 'N';
    const ϕdeg = Math.trunc(ϕabs);
    const ϕmin = Math.trunc((ϕabs-ϕdeg)*60);
    const ϕsec = Math.trunc((ϕabs-ϕdeg-ϕmin/60)*3600);
    const λabs = Math.abs(lng);
    const λdir = lng<0 ? 'W' : 'E';
    const λdeg = Math.trunc(λabs);
    const λmin = Math.trunc((λabs-λdeg)*60);
    const λsec = Math.trunc((λabs-λdeg-λmin/60)*3600);

    const dmsCoordSet = {
      lat: `${ϕdeg}° ${(ϕmin < 0) ? 0 : ϕmin}′ ${(ϕsec < 0) ? 0 : ϕsec}″ ${ϕdir}`,
      lng: `${λdeg}° ${(λmin < 0) ? 0 : λmin}′ ${(λsec < 0) ? 0 : λsec}″ ${λdir}`
    };
    return dmsCoordSet;
  }

};
