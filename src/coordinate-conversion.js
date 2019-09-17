`use strict`;

import { MilitaryGridReferenceSystem } from './military-grid-reference-system.js';
import { DecimalDegrees } from './decimal-degrees.js';
import { DegreesMinutesSeconds } from './degrees-minutes-seconds.js';
import { DegreesDecimalMinutes } from './degrees-decimal-minutes.js';
import { Distance } from './distance.js';

export class CoordinateConversion {
  MGRS; // MilitaryGridReferenceSystem;
  DDM;  // DegreesDecimalMinutes;
  DMS;  // DegreesMinutesSeconds;
  DD;   // DecimalDegrees;

  constructor() {
    return this;
  }


  /**
   * convertCoords method
   *
   * @param convertFrom - string containing MGRS, DD, DDM, DMS
   * @param coords - any containing either lat/long coords or mgrs reference
   *
   */
  convertCoords( convertFrom, coords ) {
    switch ( convertFrom ) {
      case 'MGRS': {
        this.MGRS = new MilitaryGridReferenceSystem( coords );
        this.DD = new DecimalDegrees( this.MGRS.toDD() );
        this.DMS = new DegreesMinutesSeconds( this.MGRS.toDMS() );
        this.DDM = new DegreesDecimalMinutes( this.MGRS.toDDM() );
        break;
      }
      case 'DDM': {
        this.DDM = new DegreesDecimalMinutes( coords );
        this.DD = new DecimalDegrees( this.DDM.toDD() );
        this.DMS = new DegreesMinutesSeconds( this.DDM.toDMS() );
        this.MGRS = new MilitaryGridReferenceSystem( this.DDM.toMGRS() );
        break;
      }
      case 'DMS': {
        this.DMS = new DegreesMinutesSeconds( coords );
        this.DD = new DecimalDegrees( this.DMS.toDD() );
        this.DDM = new DegreesDecimalMinutes( this.DMS.toDDM() );
        this.MGRS = new MilitaryGridReferenceSystem( this.DMS.toMGRS() );
        break;
      }
      case 'DD': {
        this.DD = new DecimalDegrees( coords );
        this.DMS = new DegreesMinutesSeconds( this.DD.toDMS() );
        this.DDM = new DegreesDecimalMinutes( this.DD.toDDM() );
        this.MGRS = new MilitaryGridReferenceSystem( this.DD.toMGRS() );
        break;
      }
    }
  }

  /**
   * distanceTo method
   *
   * @param toCoords - Coordinates class containing another coord set
   *
   * @returns number distance in meters
   */
  distanceTo( toCoords ) {
    return Distance( this, toCoords );
  }

  /**
   * setMGRS method
   *
   * @param mgrsInput - string containg mgrs reference
   *
   */
  setMGRS( mgrsInput ) {
    this.convertCoords( 'MGRS', mgrsInput );
  }

  /**
   * setDDM method
   *
   * @param ddmInput - object containing lat/lng
   *
   */
  setDDM( ddmInput ) {
    this.convertCoords( 'DDM', ddmInput );
  }

  /**
   * setDMS method
   *
   * @param dmsInput - object containing lat/lng
   *
   */
  setDMS( dmsInput ) {
    this.convertCoords( 'DMS', dmsInput );
  }

  /**
   * setDD method
   *
   * @param ddInput - object containing lat/lng
   *
   */
  setDD( ddInput ) {
    this.convertCoords( 'DD', ddInput );
  }
}
