`use strict`;

import { MilitaryGridReferenceSystem } from './military-grid-reference-system.js';
import { DecimalDegrees }              from './decimal-degrees.js';
import { DegreesMinutesSeconds }       from './degrees-minutes-seconds.js';
import { DegreesDecimalMinutes }       from './degrees-decimal-minutes.js';
import { UniversalTransverseMercator } from './universal-transverse-mercator.js';
import { Distance }                    from './distance.js';

export class CoordinateConversion {
  constructor() {
    this.MGRS; // MilitaryGridReferenceSystem;
    this.DDM;  // DegreesDecimalMinutes;
    this.DMS;  // DegreesMinutesSeconds;
    this.DD;   // DecimalDegrees;
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
      case 'UTM': {
        this.UTM = new UniversalTransverseMercator( coords );
        this.DD  = new DecimalDegrees( this.UTM.toDD() );
        this.MGRS  = new MilitaryGridReferenceSystem( this.UTM.toMGRS() );
        this.DDM  = new DegreesDecimalMinutes( this.UTM.toDDM() );
        this.DMS  = new DegreesMinutesSeconds( this.UTM.toDMS() );
        break;
      }
      case 'MGRS': {
        this.MGRS = new MilitaryGridReferenceSystem( coords );
        this.DD   = new DecimalDegrees( this.MGRS.toDD() );
        this.DMS  = new DegreesMinutesSeconds( this.MGRS.toDMS() );
        this.DDM  = new DegreesDecimalMinutes( this.MGRS.toDDM() );
        this.UTM  = new UniversalTransverseMercator( this.MGRS.toUTM() );
        break;
      }
      case 'DDM': {
        this.DDM  = new DegreesDecimalMinutes( coords );
        this.DD   = new DecimalDegrees( this.DDM.toDD() );
        this.DMS  = new DegreesMinutesSeconds( this.DDM.toDMS() );
        this.MGRS = new MilitaryGridReferenceSystem( this.DDM.toMGRS() );
        this.UTM  = new UniversalTransverseMercator( this.DDM.toUTM() );
        break;
      }
      case 'DMS': {
        this.DMS  = new DegreesMinutesSeconds( coords );
        this.DD   = new DecimalDegrees( this.DMS.toDD() );
        this.DDM  = new DegreesDecimalMinutes( this.DMS.toDDM() );
        this.MGRS = new MilitaryGridReferenceSystem( this.DMS.toMGRS() );
        this.UTM  = new UniversalTransverseMercator( this.DMS.toUTM() );
        break;
      }
      case 'DD': {
        this.DD   = new DecimalDegrees( coords );
        this.DMS  = new DegreesMinutesSeconds( this.DD.toDMS() );
        this.DDM  = new DegreesDecimalMinutes( this.DD.toDDM() );
        this.MGRS = new MilitaryGridReferenceSystem( this.DD.toMGRS() );
        this.UTM  = new UniversalTransverseMercator( this.DD.toUTM() );
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
   * setUTM method
   *
   * @param utmInput - string containg utm coordinate
   *
   */
  setUTM( utmInput ) {
    this.convertCoords( 'UTM', utmInput );
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
