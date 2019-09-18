  import { PATTERNS } from './patterns.js';

/*
 *
 * Military Grid Reference System Class
 * Defines MGRS object and functions related.
 *
 */
export class MilitaryGridReferenceSystem {
  /**
   * Constructs MilitaryGridReferenceSystem Object
   *
   * @param coords - object containing lat and lng keys
   *
   * @remarks
   * This can take in machine or user input and will normalize it to a DDM object.
   *
   * @returns MilitaryGridReferenceSystem object containing reference
   *
   */
  constructor(reference) {
    this.gridReference;
    const errors = this.validate(reference);
    if (errors.length > 0) {
      throw new Error(errors);
    }
    const mgrs = this.normalize(reference);
    this.gridReference = mgrs;
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
    if (!PATTERNS.mgrs.test(reference)) {
      errors.push('Invalid Military Grid Reference');
    }
    return errors;
  };

  /**
   * Normalizes Military Grid Reference System
   *
   * @param coords - reference string
   *
   * @returns normalized reference
   *
   */
  normalize(reference) {
    const mgrs = reference.replace(/\s/g,'');
    return mgrs;
  }

  /**
   * Converts to Universal Transverse Mercator
   *
   * @returns object containing UTM data
   *
   */
  toUTM() {
    const [lng, lat] = mgrs.toPoint(this.gridReference);
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
   * Converts to Decimal Degrees
   *
   * @returns object containing DD data
   *
   */
  toDD() {
    const [lng, lat] = mgrs.toPoint(this.gridReference);
    return {
      lat: parseFloat(lat.toFixed(5)),
      lng: parseFloat(lng.toFixed(5))
    }
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
    const ϕdd = this.toDD().lat;
    const λdd = this.toDD().lng;

    const ϕabs = Math.abs(ϕdd);
    const ϕdir = ϕdd<0 ? 'S' : 'N';
    const ϕdeg = Math.trunc(ϕabs);
    const ϕmin = Math.trunc((ϕabs-ϕdeg)*60);
    const ϕsec = Math.trunc((ϕabs-ϕdeg-ϕmin/60)*3600);
    const λabs = Math.abs(λdd);
    const λdir = λdd<0 ? 'W' : 'E';
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
   * Converts to Degrees Decimal Minutes
   *
   * @returns object containing DDM data
   *
   */
  toDDM() {
    // ϕ = latitude
    // λ = longitude
    const ϕdd = this.toDD().lat;
    const λdd = this.toDD().lng;

    const ϕabs = Math.abs(ϕdd);
    const ϕdir = ϕdd<0 ? 'S' : 'N';
    const ϕdeg = Math.trunc(ϕabs);
    const ϕmin = parseFloat(parseFloat(`${(ϕabs-ϕdeg)*60}`).toFixed(5));
    const λabs = Math.abs(λdd);
    const λdir = λdd<0 ? 'W' : 'E';
    const λdeg = Math.trunc(λabs);
    const λmin = parseFloat(parseFloat(`${(λabs-λdeg)*60}`).toFixed(5));

    const ddmCoordSet = {
      lat: `${ϕdeg}° ${(ϕmin<0) ? 0 : ϕmin}′ ${ϕdir}`,
      lng: `${λdeg}° ${(λmin<0) ? 0 : λmin}′ ${λdir}`
    };
    return ddmCoordSet;
  }

};
