/*
 * Distance method
 *
 * @param Setα - Decimal Degrees latitude/longitude set
 * @param Setβ - Decimal Degrees latitude/longitude set
 *
 */
export function Distance(Setα, Setβ) {
  const toRadians = (num) => num * Math.PI / 180;
  const R = 6371e3; // Radius metres
  const φ1 = toRadians(Setα.DD.lat);
  const φ2 = toRadians(Setβ.DD.lat);
  const Δφ = toRadians(Setβ.DD.lat-Setα.DD.lat);
  const Δλ = toRadians(Setβ.DD.lng-Setα.DD.lng);

  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1)   * Math.cos(φ2)   *
            Math.sin(Δλ/2) * Math.sin(Δλ/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

  const d = R * c;

  return parseFloat(d.toFixed(5));
};
