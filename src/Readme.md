# Coordinate Conversion Class

Class for doing work with various coordinate systems. Currently supporting:

* MGRS - Military Grid Reference System
* DD - Decimal Degrees
* DDM - Degrees Decimal Minutes
* DMS - Degrees Minutes Seconds

## Usage

    import { CoordinateConversion } from '@classes/coordinate-conversion/coordinate-conversion.class';


    // Instantiate New Coordinates
    const coordSet = new CoordinateConversion();

    // Set any coordinate type and the script will automatically computer each other set.

    // Set MGRS
    coordSet.setMGRS('44TMK1367177758');

    // Set DDM
    coordSet.setDDM({ lat: '40° 26.5994′ N', lng: '79° 58.1994′ E' });

    // Set DMS
    coordSet.setDMS({ lat: '40° 26′ 45"', lng: '79° 58′ 55.1994"' });

    // Set DD
    coordSet.setDD({ lat: '40.446°', lng: '79.982°' });

## Functions

### Distance

    const TheWhiteHouse = new CoordinateConversion();
          TheWhiteHouse.setMGRS('18SUJ2339407395');
    const GoldenGateBridge = new CoordinateConversion();
          GoldenGateBridge.setMGRS('10SEG4588885941');

    const distance = TheWhiteHouse.distanceTo(GoldenGateBridge);

    console.log(distance);

    // Returns meters: 3922415.42427

## Example Output

    Coordinates {
      MGRS: MilitaryGridReferenceSystem {
        gridReference: '44TMK1367177758'
      },
      DD: DecimalDegrees {
        lat: 40.446,
        lng: 79.982
      },
      DMS: DegreesMinutesSeconds {
        lat: {
          degrees: 40,
          minutes: 26,
          seconds: 45,
          direction: 'N',
          display: '40° 26′ 45″ N'
        },
        lng: {
          degrees: 79,
          minutes: 58,
          seconds: 55,
          direction: 'E',
          display: '79° 58′ 55″ E'
        }
      },
      DDM: DegreesDecimalMinutes {
        lat: {
          degrees: 40,
          minutes: 26.76,
          direction: 'N',
          display: '40° 26.76′ N'
        },
        lng: {
          degrees: 79,
          minutes: 58.92,
          direction: 'E',
          display: '79° 58.92′ E'
        }
      }
    }
