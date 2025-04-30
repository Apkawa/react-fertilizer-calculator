
import {DATA_KEYS, DENSITY_DATA} from "./constants";
import {Spline} from "./interpolation";


/**
 * Расчет плотности интерполяцией по концентрации
 *
 * @param key of `DATA_KEYS`
 * @param concentration - г\л
 */
export function getDensityFromConcentration(key: DATA_KEYS, concentration: number) {
  const data = DENSITY_DATA[key]
  const xs = data.map(xy => xy[0])
  const ys = data.map(xy => xy[1])
  const spline = new Spline(xs, ys)
  return spline.at(concentration)
}

/**
 * Расчет концентрации по плотности
 * @param key of `DATA_KEYS`
 * @param density - плотность, в г/мл
 */
export function getConcentrationFromDensity(key: DATA_KEYS, density: number) {
  const data = DENSITY_DATA[key]
  const xs = data.map(xy => xy[0])
  const ys = data.map(xy => xy[1])
  // Reverse function
  const spline = new Spline(ys, xs)
  return spline.at(density)
}
