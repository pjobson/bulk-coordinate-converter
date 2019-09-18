import { PATTERNS } from './patterns.js';

export class DegreesMinutesSeconds {
  /**
   * Constructs DegreesMinutesSeconds Object
   *
   * @param coords - object containing lat and lng keys
   *
   * @remarks
   * This can take in machine or user input and will normalize it to a DMS object.
   *
   * @returns DegreesMinutesSeconds object containing latitude and logitude
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
    if (!PATTERNS.dmsLat.test(coords.lat)) {
      errors.push('Invalid Latitude');
    }
    if (!PATTERNS.dmsLng.test(coords.lng)) {
      errors.push('Invalid Longitude');
    }
    return errors;
  };

  /**
   * Normalizes Degrees Minutes Seconds
   *
   * @param coords - object containing lat and lng keys
   *
   * @returns normalized coordinates
   *
   */
  normalize(coords) {
    const nCoords = {};
    for (let key in coords) {
      const parts = coords[key].replace(/\s+/g,'').split(/[^-\+\d\.NSEWnsew]/);
      nCoords[key] = {
        degrees: Math.abs(parseInt(parts[0], 10)),
        minutes: parseInt(parts[1], 10),
        seconds: parseFloat(parts[2])
      }
      if (key==='lat') {
        nCoords[key].direction = (parts[3].length>0) ?
                                 parts[3].toUpperCase() :
                                 (parseInt(parts[0], 10)<0) ?
                                 'S' : 'N';
      } else {
        nCoords[key].direction = (parts[3].length>0) ?
                                 parts[3].toUpperCase() :
                                 (parseInt(parts[0], 10)<0) ?
                                 'W' : 'E';
      }
      nCoords[key].display = `${nCoords[key].degrees}° ${nCoords[key].minutes}′ ${nCoords[key].seconds}″ ${nCoords[key].direction}`;
    }
    return nCoords;
  };

  /**
   * Converts Degrees Minutes Seconds to Universal Transverse Mercator
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
   * Converts Degree Minute Second to Decimal Degrees
   *
   * @returns object containing DD data
   *
   */
  toDD() {
    // ϕ = latitude
    // λ = longitude
    const ϕ = (this.lat.degrees +
              (this.lat.minutes/60) +
              (this.lat.seconds/3600)) *
              (this.lat.direction === 'S' ? -1 : 1);
    const λ = (this.lng.degrees +
              (this.lng.minutes/60) +
              (this.lng.seconds/3600)) *
              (this.lng.direction === 'W' ? -1 : 1);
    const ddCoordSet = {
      lat: parseFloat(ϕ.toFixed(5)),
      lng: parseFloat(λ.toFixed(5))
    };
    return ddCoordSet;
  };

  /**
   * Converts Degrees Minutes Seconds to Degree Decimal Minutes
   *
   * @returns object containing DDM data
   *
   */
  toDDM() {
    // ϕ = latitude
    // λ = longitude
    const ϕdir = this.lat.direction;
    const ϕdeg = this.lat.degrees;
    const ϕmin = parseFloat((this.lat.minutes + (this.lat.seconds/3600)).toFixed(5));
    const λdir = this.lng.direction;
    const λdeg = this.lng.degrees;
    const λmin = parseFloat((this.lng.minutes + (this.lng.seconds/3600)).toFixed(5));

    const ddmCoordSet = {
      lat: `${ϕdeg}° ${(ϕmin<0) ? 0 : ϕmin}′ ${ϕdir}`,
      lng: `${λdeg}° ${(λmin<0) ? 0 : λmin}′ ${λdir}`
    }

    return ddmCoordSet;
  };

  toMGRS() {
    const dd = this.toDD();
    return mgrs.forward([dd.lng, dd.lat], 5);
  };
};
