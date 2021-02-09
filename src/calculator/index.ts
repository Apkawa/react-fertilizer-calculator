import {combination, product} from "./itertools";
import {countDecimals, entries, keys, round, sum, values} from "../utils";
import {FERTILIZER_ELEMENT_NAMES, MACRO_ELEMENT_NAMES, MICRO_ELEMENT_NAMES} from "./constants";
import {Elements, Fertilizer, FertilizerInfo, NeedElements} from "./types";
import {getEmptyElements, getFillElementsByType} from "./helpers";
import {normalizeFertilizer} from "./fertilizer";


export interface FertilizerWeights {
  id: string,
  // г/л
  weight: number
  base_weight: number,
  // Если удобрение в жидком виде, в мл
  volume?: number | null,
  // Если задана плотность
  liquid_weight?: number | null,
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

export type IgnoreElements = {
  [E in keyof Elements]?: boolean
}

export interface CalculateOptions {
  accuracy?: number,
  max_iterations?: number,
  ignore?: IgnoreElements,
  solution_volume?: number,
  solution_concentration?: number,
  // Необходимо для расчета с использованием предыдущих данных,
  // например, после расчета микроэлементов добавляются макроэлементы и надо их как то учитывать и наоборот
  prevElements?: Elements,
}

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


export function getScoreElement(needElements: NeedElements, currentElements: Elements): Elements {
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

// Оптимизация подбора путем разделения удобрений на макро и микро
export function calculate_v4(
  needElements: NeedElements,
  fertilizers: FertilizerInfo[],
  options: CalculateOptions = {}
): CalculateResult {

  let macroFertilizers = fertilizers.filter(f => !MICRO_ELEMENT_NAMES.filter(n => f.npk?.[n]).length)
  let microFertilizers = fertilizers.filter(f => MICRO_ELEMENT_NAMES.filter(n => f.npk?.[n]).length)

  let microResult = calculate_v3(needElements, microFertilizers,
    {...options, ignore: {...options.ignore, ...getFillElementsByType(true).macro}})

  MACRO_ELEMENT_NAMES.forEach(e => {
    needElements[e] = needElements?.[e] || 0 - microResult.elements[e]
  })

  let macroResult = calculate_v3(needElements, macroFertilizers,
    {...options, ignore: {...options.ignore, ...getFillElementsByType(true).micro}})


  let elementsEntries = entries(macroResult.elements).map(([e, v]) => [e, v + microResult.elements[e]])
  let elements = Object.fromEntries(elementsEntries)
  let deltaElements = FERTILIZER_ELEMENT_NAMES.map((e) => [e, (needElements[e]||0) - elements[e]])

  let scores = []
  if (macroFertilizers.length > 0) {
    scores.push(macroResult.score)
  }
  if (microFertilizers.length > 0) {
    scores.push(microResult.score)
  }

  let result: CalculateResult = {
    fertilizers: [
      ...macroResult.fertilizers,
      ...microResult.fertilizers
    ],
    elements,
    deltaElements: Object.fromEntries(deltaElements),
    score: round(sum(scores) / scores.length,1),
    stats: {
      time: macroResult.stats.time + microResult.stats.time,
      count: macroResult.stats.count + microResult.stats.count,
    }

  }

  return result
}

// Подбор оптимального количества путем пересортировки удобрений
export function calculate_v3(
  needElements: NeedElements,
  fertilizers: FertilizerInfo[],
  options: CalculateOptions = {}
): CalculateResult {

  let result: CalculateResult | null = null
  const time = new Date().getTime();
  let count = 0;
  for (let f of combination(fertilizers)) {
    if (count > 3000) {
      // Решение скорее всего не существует, таймаут
      break
    }
    const r = calculate_v2(needElements, f, options)
    if (!result) {
      result = r
      continue
    }
    if (result.score >= 100) {
      break
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

const ElementPriority: Partial<NeedElements> = {
  'NH4': 2000,
  'P': 2000,
  'B': 5000,
}

// Алгоритм расчетов из https://github.com/siv237/HPG
export function calculate_v2(
  needElements: NeedElements,
  fertilizers: FertilizerInfo[],
  options: CalculateOptions = {}
): CalculateResult {
  const {
    accuracy = 0.1,
    ignore = {},
    solution_volume = 1,
    solution_concentration = 1,
    prevElements = getEmptyElements(),
  } = options || {}
  const precision = countDecimals(accuracy)
  let ignoredElements: Elements = getEmptyElements()
  let _priority = {
    ...getFillElementsByType(1000).macro,
    ...getFillElementsByType(3000).micro,
    ...ElementPriority
  }
  for (let key of keys(ignoredElements)) {
    if (ignore[key]) {
      ignoredElements[key] = 1
    }
    if (typeof needElements[key] == "undefined") {
      ignoredElements[key] = 1
    }
    // Понижаем приоритет если игнорируется
    if (_priority?.[key] && ignoredElements[key]) {
      _priority[key] = (_priority[key] || 0) - 1000
    }
  }


  const fertilizerMap = Object.fromEntries(fertilizers.map(f => [f.id, f]))
  const normalizedFertilizers = fertilizers.map(f => normalizeFertilizer(f));
  let weights: { [K: string]: FertilizerWeights } = Object.fromEntries(
    fertilizers.map(v => ([v.id, {
      id: v.id,
      weight: 0,
      base_weight: 0,
      volume: null,
    }])))
  const xElements = {...needElements}
  const calcElements = prevElements;

  for (let f of normalizedFertilizers) {
    let p = entries(f.elements)
      // Удаляем нулевой вес
      .filter(v => v[1])
      .sort((a, b) => {
          let cmp1 = ((_priority?.[b[0]] || 0) - (_priority?.[a[0]] || 0))
          let cmp2 = (
            ((xElements[a[0]] || 0) / a[1] - (xElements[b[0]] || 0) / b[1])
          )
          return cmp1 + cmp2
        }
      )

    let primaryElement = p.filter(([a]) => (xElements[a] || 0) > 0 && (needElements[a] || 0) > 0)?.[0]?.[0]
    // Стараемся принять во внимание комплексные удобрения вроде акварина
    let skipFert = p.filter(([a]) => (needElements[a] || 0) <= 0 && !ignoredElements[a]).length === 1
    if (!primaryElement || skipFert) {
      continue
    }

    let m = Object.fromEntries(p)
    let weight = (xElements[primaryElement] || 0) / (m[primaryElement] * 10)
    let fInfo = fertilizerMap[f.id]
    weights[f.id].base_weight = round(weight, precision > 3 ? precision : 3)
    weights[f.id].weight = round(weight * solution_volume * solution_concentration, precision)
    if (fInfo.solution_concentration) {
      weights[f.id].volume = round((weights[f.id].weight * 1000) / fInfo.solution_concentration, precision)
    }
    let volume = weights[f.id].volume
    if (fInfo.solution_density && volume) {
      weights[f.id].liquid_weight = round(volume * (fInfo.solution_density / 1000), precision)
    }

    for (let [a, v] of p) {
      const e = weight * v * 10
      // Плавающая точность. повышаем точность в случае микроэлементов, при выводе домножить до 1000
      let elementPrecision = countDecimals(needElements[a] || 0)
      if (MICRO_ELEMENT_NAMES.includes(a as MICRO_ELEMENT_NAMES)) {
        // Принудительно повышаем точность для микроэлементов
        elementPrecision = 4
      }
      calcElements[a] += round(e, elementPrecision)
      xElements[a] = (xElements[a] || 0) - e
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
  const needElementsLength = keys(ignoredElements).length
  const totalScore = round(100 / ((score_percent - (needElementsLength - ignored)) / (needElementsLength - ignored) + 1), 2)

  const deltaElementsPairs = entries(calcElements).map(([k, v]) => {
    let dv = round((needElements[k] || 0) - v || 0, 1)
    if (!dv) {
      // удаляем знак у нуля
      dv = 0
    }
    return [k, dv]
  })
  const deltaElements = Object.fromEntries(deltaElementsPairs)

  return {
    fertilizers: values(weights)
      .map(v => ({
        ...v,
        base_weight: round(v.base_weight, precision),
        weight: round(v.weight, precision),
      }))
      .filter(v => v.weight),
    elements: calcElements,
    deltaElements,
    score: totalScore || 0,
    stats: {
      count: 0,
      time: 0,
    }
  }


}

// DEPRECATED
export function calculate_v1(
  needElements: NeedElements,
  fertilizers: Fertilizer[],
  options: CalculateOptions = {},
): CalculateResult {

  const time = new Date().getTime();
  let count = 0;
  const {
    accuracy = 0.1,
    max_iterations = 25,
    ignore = {},
  } = options || {}
  const precision = countDecimals(accuracy)
  let weights: FertilizerWeights[] = fertilizers.map(v => ({
    id: v.id,
    weight: max_iterations,
    base_weight: max_iterations
  }))

  let ignoredElements: Elements = getEmptyElements()
  for (let [key, flag] of entries(ignore)) {
    if (flag) {
      ignoredElements[key] = 1
    }
  }

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
    return [k, needElements?.[k] || 0 - v]
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
