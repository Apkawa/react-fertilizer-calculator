import {combination, product} from "./itertools";
import {countDecimals, entries, keys, round, sum, values} from "../utils";
import {FERTILIZER_ELEMENT_NAMES} from "./constants";
import {Elements, Fertilizer} from "./types";
import {getEmptyElements} from "./helpers";


export interface FertilizerWeights {
  id: string,
  // г/л
  weight: number
  base_weight: number,
}

export interface CalculateResult {
  fertilizers: FertilizerWeights[],
  elements: Elements,
  deltaElements: Elements,
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
  ignore_S?: boolean,
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
    } else {
      if (curVal === value) {
        // В рецепте тоже ноль
        score = 1.0
      }
    }
    return [key, score]
  })
  return Object.fromEntries(pairs)
}

// Подбор оптимального количества путем пересортировки удобрений
export function calculate_v3(
  needElements: Elements,
  fertilizers: Fertilizer[],
  options: CalculateOptions = {}
): CalculateResult {

  let result: CalculateResult|null = null
  const time = new Date().getTime();
  let count = 0;
  for (let f of combination(fertilizers)) {
    const r = calculate_v2(needElements, f, options)
    if (!result) {
      result = r
      continue
    }
    if (result.score < r.score) {
      result = r
    }
    count += 1
  }
  if (result) {
    result.stats.count = count
    result.stats.time = (new Date().getTime() - time) / 1000
  }
  return result as CalculateResult

}

// Алгоритм расчетов из https://github.com/siv237/HPG
export function calculate_v2(
  needElements: Elements,
  fertilizers: Fertilizer[],
  options: CalculateOptions = {}
): CalculateResult {
  const {
    accuracy = 0.1,
    ignore_Ca = false,
    ignore_Mg = false,
    ignore_S = false,
  } = options || {}
  const precision = countDecimals(accuracy)
  let ignoredElements: Elements = getEmptyElements()

  if (ignore_Ca) {
    ignoredElements.Ca = 1
  }
  if (ignore_Mg) {
    ignoredElements.Mg = 1
  }
  if (ignore_S) {
    ignoredElements.S = 1
  }

  let weights: { [K: string]: FertilizerWeights } = Object.fromEntries(
    fertilizers.map(v => ([v.id, {
      id: v.id,
      weight: 0,
      base_weight: 0
    }])))
  const xElements = {...needElements}
  const calcElements = getEmptyElements()

  for (let f of fertilizers) {
    let p = entries(f.elements)
      .filter(v => v[1])
      .sort((a, b) => xElements[a[0]] / a[1]  - xElements[b[0]] / b[1])
    let primaryElement = p.filter(([a]) => xElements[a] > 0 && needElements[a] > 0)?.[0]?.[0]
    let skipFert = p.filter(([a]) => needElements[a] <= 0 && !ignoredElements[a]).length > 0
    if (!primaryElement || skipFert) {
      continue
    }


    let m = Object.fromEntries(p)
    let weight = xElements[primaryElement] / (m[primaryElement] * 10)
    weights[f.id].weight = weight
    for (let [a, v] of p) {
      const e = round(weight * v * 10, precision)
      calcElements[a] += round(e)
      xElements[a] -= e
    }
  }
  let score_el: Elements = getScoreElement(needElements, calcElements)
  for (let [e, v] of entries(ignoredElements)) {
    if (v) {
      score_el[e] = 0
    }
  }
  const score_percent = sum(Object.values(score_el))

  let ignored = sum(values(ignoredElements));
  const needElementsLength = keys(needElements).length
  const totalScore = Math.round(100 / ((score_percent - (needElementsLength - ignored)) / (needElementsLength - ignored) + 1))

  const deltaElementsPairs = entries(calcElements).map(([k, v]) => {
    return [k, round(needElements[k] - v, 2)]
  })
  const deltaElements = Object.fromEntries(deltaElementsPairs)

  return  {
    fertilizers: values(weights)
        .map(v => ({...v, weight: round(v.weight, precision)}))
        .filter(v => v.weight),
    elements: calcElements,
    deltaElements,
    score: totalScore,
    stats: {
      count: 0,
      time: 0,
    }
  }


}

export function calculate_v1(
  needElements: Elements,
  fertilizers: Fertilizer[],
  options: CalculateOptions = {},
): CalculateResult {

  const time = new Date().getTime();
  let count = 0;
  const {
    accuracy = 0.1,
    max_iterations = 25,
    ignore_Ca = false,
    ignore_Mg = false,
    ignore_S = false,
  } = options || {}
  const precision = countDecimals(accuracy)
  let weights: FertilizerWeights[] = fertilizers.map(v => ({
    id: v.id,
    weight: max_iterations,
    base_weight: max_iterations
  }))

  let ignoredElements: Elements = getEmptyElements()
  if (ignore_Ca) {
    ignoredElements.Ca = 1
  }
  if (ignore_Mg) {
    ignoredElements.Mg = 1
  }
  if (ignore_S) {
    ignoredElements.S = 1
  }
  // for (let [e, v] of entries(needElements)) {
  //   if (v === 0) {
  //     ignoredElements[e] = 1
  //   }
  // }

  let best_score = 1000000;
  let score;
  let score_percent = 0;
  let calculatedElements: Elements = getEmptyElements()

  const accuracyList = [0.2, 0.1, 0.05, 0.01]
  let step = accuracyList[0] * 10;

  for (let currentAccuracy of accuracyList) {
    if (currentAccuracy < accuracy) {
      break
    }

    const _step = step
    const weightRanges = weights.map(w => {
      const ranges = []
      const weight = w.weight < _step ? _step : w.weight
      let minWeight = weight - _step
      let maxWeight = weight + _step
      if (weight === max_iterations) {
        // Maybe first iteration
        minWeight = 0
        maxWeight = max_iterations
      }
      for (let i = minWeight; i <= maxWeight; i += _step) {
        ranges.push(i)
      }
      return ranges
    })


    const it = product(...weightRanges)

    for (let portions of it) {
      let n_el: Elements = sumFertilizers(fertilizers, portions)
      let score_el: Elements = getScoreElement(needElements, n_el)

      for (let [e, v] of entries(ignoredElements)) {
        if (v) {
          score_el[e] = 0
        }
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
    step = currentAccuracy * 10;
  }


  for (let [k, v] of entries(calculatedElements)) {
    calculatedElements[k] = round(v)
  }

  const deltaElementsPairs = entries(calculatedElements).map(([k, v]) => {
    return [k, needElements[k] - v]
  })
  const deltaElements = Object.fromEntries(deltaElementsPairs)

  let ignored = sum(values(ignoredElements));
  const needElementsLength = keys(needElements).length
  const totalScore = Math.round(100 / ((score_percent - (needElementsLength - ignored)) / (needElementsLength - ignored) + 1))
  return {
    fertilizers: weights.map(v => ({...v, weight: round(v.weight / 10, precision)})),
    score: totalScore,
    elements: calculatedElements,
    deltaElements,
    stats: {
      time: (new Date().getTime() - time) / 1000,
      count: count,
    }
  }
}
