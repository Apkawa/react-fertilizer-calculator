import {product} from "./itertools";

type Entries<T> = {
  [K in keyof T]: [K, T[K]];
}[keyof T][];


export interface Elements {
  N: number,
  P: number,
  K: number,
  Ca: number,
  Mg: number,
}


export interface Fertilizer extends Elements {
  id: string,
}

export interface FertilizerWeights {
  id: string,
  weight: number
}

export interface CalculateResult {
  fertilizers: FertilizerWeights[],
  score: number,
  stats: {
    time: number,
    count: number,
  }
}

export interface CalculateOptions {
  accuracy?: number,
  max_iterations?: number,
  ignore_Ca?: boolean,
  ignore_Mg?: boolean,
}

const COEFFICIENT_OF_ELEMENTS: Elements = {
  N: 1,
  P: 0.436,
  K: 0.83,
  Mg: 0.6,
  Ca: 0.715,

}

export function sum(values: number[]) {
  return values.reduce((a, b) => a + b, 0)
}

export function round(number: number, precision: number = 0) {
  const p = Math.pow(10, precision)
  return Math.round((number + Number.EPSILON) * p) / p
}

export function countDecimals(value: number): number {
  if (Math.floor(value.valueOf()) === value.valueOf()) return 0;
  return value.toString().split(".")[1].length || 0;
}

export function sumFertilizers(fertilizers: Fertilizer[], portions: number[]): Elements {
  let el = Object.entries(COEFFICIENT_OF_ELEMENTS) as Entries<Elements>
  return <unknown>(Object.fromEntries(el.map(([key, coefficient]) =>
    [
      key,
      sum(
        portions.map(
          (weight, index) => weight * coefficient * fertilizers[index][key])
      )
    ]
  ))) as Elements
}


export function getScoreElement(needElements: Elements, currentElements: Elements): Elements {
  let entries = Object.entries(needElements) as Entries<Elements>
  return <unknown>Object.fromEntries(entries.map(([key, value]) => {
    let curVal = currentElements[key]
    let score = 100
    if (curVal !== 0) {
      if (curVal < value) {
        score = value / curVal;
      } else {
        score = curVal / value
      }
    }
    return [key, score]
  })) as Elements

}

export function calculate(
  needElements: Elements,
  fertilizers: Fertilizer[],
  options: CalculateOptions = {},
): CalculateResult {

  const time = new Date().getTime();
  let count = 0;
  const {accuracy = 0.1, max_iterations = 15} = options || {}
  const precision = countDecimals(accuracy)
  let weights: FertilizerWeights[] = fertilizers.map(v => ({id: v.id, weight: max_iterations}))

  let best_score = 1000000;
  let score;
  let score_percent = 0;


  for (let currentAccuracy of [0.5, 0.2, 0.1, 0.05, 0.01]) {
    if (currentAccuracy < accuracy) {
      break
    }
    const step = currentAccuracy * 10;

    const weightRanges = weights.map(w => {
      const ranges = []
      const weight = w.weight < step ? step : w.weight
      let minWeight = weight - step
      let maxWeight = weight + step
      if (weight === max_iterations) {
        // Maybe first iteration
        minWeight = 0
        maxWeight = max_iterations
      }
      for (let i = minWeight; i <= maxWeight; i += step) {
        ranges.push(i)
      }
      return ranges
    })

    const it = product(...weightRanges)

    for (let portions of it) {
      let n_el: Elements = sumFertilizers(fertilizers, portions)
      let score_el: Elements = getScoreElement(needElements, n_el)
      if (options.ignore_Ca) {
        score_el.Ca = 0
      }
      if (options.ignore_Mg) {
        score_el.Mg = 0
      }
      count += 1
      const current_score = sum(Object.values(score_el))
      score = sum(Object.values(score_el).map(v => Math.pow(v, 2)))
      if (best_score > score) {
        best_score = score
        score_percent = current_score
        weights.forEach((v, index) => {
          v.weight = portions[index]
        })
      }
    }
    weights = weights.filter(v => v.weight > 0)
    fertilizers = fertilizers.filter(f => {
      for (let w of weights) {
        if (w.id === f.id) {
          return true
        }
      }
      return false
    })
  }

  var ignored = 0;
  if (options.ignore_Ca) {
    ignored += 1
  }
  if (options.ignore_Mg) {
    ignored += 1
  }
  const result: CalculateResult = {
    fertilizers: weights.filter(v => v.weight > 0)
      .map(v => ({...v, weight: round(v.weight / 10, precision)})),
    score: Math.round(100 / ((score_percent - (5 - ignored)) / (5 - ignored) + 1)),
    stats: {
      time: (new Date().getTime() - time) / 1000,
      count: count,
    }
  }
  return result
}
