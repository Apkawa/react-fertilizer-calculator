import {product} from "./itertools";
import {countDecimals, entries, round, sum} from "../utils";
import {Elements, Fertilizer} from "./fertilizer";
import {FERTILIZER_ELEMENT_NAMES} from "./constants";


export interface FertilizerWeights {
  id: string,
  // г/л
  weight: number
  base_weight: number,
}

export interface CalculateResult {
  fertilizers: FertilizerWeights[],
  elements: Elements,
  score: number,
  stats: {
    time: number,
    count: number,
  },
}

export interface CalculateOptions {
  accuracy?: number,
  max_iterations?: number,
  ignore_Ca?: boolean,
  ignore_Mg?: boolean,
}

/*
TODO
P  x 2,29 =P2O5
K  x 1,2  =K2O
Ca x 1,4  =Ca0
Mg x 1,66 =Mg
S  x 2,5  =SO3
S  x 3    =SO4
N  x 4,43 =NO3

и в обратную сторону

P2O5 x 0,44 =P
K2O  x 0,83 =K
CaO  x 0,71 =Ca
MgO  x 0,6  =Mg
SO3  x 0,4  =S
SO4  x 0,33 =S
NO3  x 0,22 =N
 */


export function sumFertilizers(fertilizers: Fertilizer[], portions: number[]): Elements {
  const pairs = FERTILIZER_ELEMENT_NAMES.map(key =>
    [
      key,
      sum(
        portions.map(
          (weight, index) => weight * fertilizers[index].elements[key])
      )
    ]
  )
  return Object.fromEntries(pairs)
}


export function getScoreElement(needElements: Elements, currentElements: Elements): Elements {
  let pairs = entries(needElements).map(([key, value]) => {
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
  })
  return Object.fromEntries(pairs)

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
  let weights: FertilizerWeights[] = fertilizers.map(v => ({
    id: v.id,
    weight: max_iterations,
    base_weight: max_iterations
  }))

  let best_score = 1000000;
  let score;
  let score_percent = 0;
  let calculatedElements: Elements = { N: 0, P: 0, K: 0, Ca: 0, Mg: 0}


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
        calculatedElements = n_el
        best_score = score
        score_percent = current_score
        weights.forEach((v, index) => {
          v.base_weight = portions[index]
          v.weight = portions[index]
        })
      }
    }
    weights = weights.filter(v => v.weight > 0)
    let newFertilizers: Fertilizer[] = []
    for (let f of fertilizers) {
      for (let w of weights) {
        if (w.id === f.id) {
          newFertilizers.push(f)
        }
      }
    }
    fertilizers = newFertilizers
  }

  let ignored = 0;
  if (options.ignore_Ca) {
    ignored += 1
  }
  if (options.ignore_Mg) {
    ignored += 1
  }
  for (let [k, v] of entries(calculatedElements)) {
    calculatedElements[k] = round(v)
  }

  return {
    fertilizers: weights.map(v => ({...v, weight: round(v.weight / 10, precision)})),
    elements: calculatedElements,
    score: Math.round(100 / ((score_percent - (5 - ignored)) / (5 - ignored) + 1)),
    stats: {
      time: (new Date().getTime() - time) / 1000,
      count: count,
    }
  }
}
