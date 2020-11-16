
import {DATA_KEYS, DENSITY_DATA} from "./constants";
import {Spline} from "./interpolation";


export function getDensityFromConcentration(key: DATA_KEYS, concentration: number) {
  const data = DENSITY_DATA[key]
  const xs = data.map(xy => xy[0])
  const ys = data.map(xy => xy[1])
  const spline = new Spline(xs, ys)
  return spline.at(concentration)
}

export function getConcentrationFromDensity(key: DATA_KEYS, density: number) {
  const data = DENSITY_DATA[key]
  const xs = data.map(xy => xy[0])
  const ys = data.map(xy => xy[1])
  // Reverse function
  const spline = new Spline(ys, xs)
  return spline.at(density)
}
