/**
 * A set of patterns to test lat/long values against in order to determine the format -
 * Decimal degrees, degrees/minutes/seconds or degrees with decimal minutes. This is
 * important as most maritime and some aerospace locations are transmitted in
 * degrees/minutes/seconds or in some cases degrees with decimal minutes. Most landbased
 * applications will use a latitude/longitude in decimal degrees. The patterns use
 * capturing pattern groups for additional use in not just testing a value but also
 * capturing important components of the location component for other uses.
 *
 * `ddLat` will capture any floating point values ranging from -90 to 90 inclusively.
 *    Any fractional values of -90 or 90 will fail the match even if the fractional
 *    component does not extend the value beyond the valid range. I.e., a value of
 *    90.000000 will fail to match the pattern but 90 will match. The only valid
 *    non-digit charaters permitted are '+', '-' and '.'.
 *    MATCHES: 40.446, 90, -90, 38.112343, and -32.12345.
 *
 * `ddLng` will capture any floating point values ranging from -180 to 180 inclusively.
 *    Any fractional values of -180 or 180 will fail the match even if the fractional
 *    component does not extend the value beyond the valid range. I.e., a value of
 *    -180.000000 will fail to match the pattern but -180 will match. The only valid
 *    non-digit charaters permitted are '+', '-' and '.'.
 *    MATCHES: 40.446, 90.12323, -90, 38.112343, 123.90898, -132.4538, 180 and -180.
 *
 * `dmsLat` will capture degree/minutes/seconds and direction (N or S), in that order,
 *    ranging from 0 to 90. Minutes and seconds will range from 0 to 60.
 *
 * `dmsLng` will capture degree/minutes/seconds and direction (E or W), in that order,
 *    ranging from 0 to 180. Minutes and seconds will range from 0 to 60.
 *
 * `ddmLat` will capture degree/minutes and direction (N or S), in that order, ranging
 *    from 0 to 90. Minutes will range from 0 to 60 including any decimal portion of minute.
 *
 * `ddmLng` will capture degree/minutes and direction (E or W), in that order, ranging from
 *    0 to 180. Minutes will range from 0 to 60 including any decimal portion of minute.
 *
 *  `mgrs` will capture the GZD (Grid Zone Designator), square (100k square block identifier)
 *    and the combined easting/northing. When using this pattern, ensure that the string you
 *    are matching against has had all whitespace removed.
 *
 * NOTE: Regarding precision:
 * - For decimal lat/long values, any value beyond the 6th decimal place is precision to the
 *   millimeter or below and more often than not are typically an indication that a computer
 *   was used to calculate the value without rounding. For most applications, a 6 decimal
 *   maximum is sufficient precision at roughly a 0.1 meter margin of error. This library
 *   stops at 6 decimal places for this reason.
 * - For degrees/decimal minutes, we support fractional minutes up to 5 decimal places for the
 *   above reason.
 *
 * https://gist.github.com/cgudea/7c558138cb48b36e785b#file-geodesy_regex-py
 * https://gist.github.com/pjobson/8f44ea79d1852900457bc257a4c9fcd5
 */
export const PATTERNS = {
  ddLat:  /^[\+-]?(([1-8]?\d)(\.\d{1,})?|90)\D*[NSns]?$/,
  ddLng:  /^[\+-]?((1[0-7]\d|[1-9]?\d)(\.\d{1,})?|180)\D*[EWew]?$/,
  dmsLat: /^[\+-]?(([1-8]?\d)\D+([0-5]?\d|60)\D+([0-5]?\d|60)(\.\d+)?|90\D+0\D+0)\D+[NSns]?$/,
  dmsLng: /^[\+-]?([1-7]?\d{1,2}\D+([0-5]?\d|60)\D+([0-5]?\d|60)(\.\d+)?|180\D+0\D+0)\D+[EWew]?$/,
  ddmLat: /^[\+-]?(([1-8]?\d)\D+[1-6]?\d(\.\d{1,})?|90(\D+0)?)\D+[NSns]?$/,
  ddmLng: /^[\+-]?((1[0-7]\d|[1-9]?\d)\D+[1-6]?\d(\.\d{1,})?|180(\D+0)?)\D+[EWew]?$/,
  mgrs:   /^([1-5]?\d|60)\s?([^ABIOYZabioyz])\s?([A-Za-z]{2})\s?(\d{10}|\d{8}|\d{6}|\d{4}|\d{2}|\d{1,5}\s\d{1,5})$/,
  utm:    /^([1-6]\d|[1-9])([C-Xc-x])\s+(\d+(?:\.\d+)?)\s+(\d+(?:\.\d+)?)$/
};

export const CombinedExpressions = {
  lat: new RegExp(`^${[PATTERNS.ddLat, PATTERNS.dmsLat, PATTERNS.ddmLat].map(ptrn => ptrn.toString().replace(/^\/\^(.+?)\$\//g,'($1)')).join('|')}$`),
  lng: new RegExp(`^${[PATTERNS.ddLng, PATTERNS.dmsLng, PATTERNS.ddmLng].map(ptrn => ptrn.toString().replace(/^\/\^(.+?)\$\//g,'($1)')).join('|')}$`)
}
