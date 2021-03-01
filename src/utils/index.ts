export const keys = Object.keys as <T>(o: T) => (Extract<keyof T, string>)[];
export const entries = Object.entries as <T>(
  o: T
) => [Extract<keyof T, string>, Exclude<T[keyof T], undefined>][]

export const values = Object.values as <T>(
  o: T
) => (Exclude<T[keyof T], undefined>)[]

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

export function tryParseFloat(value: string): number | string {
  let v = parseFloat(value)
  if (!isNaN(v)) {
    return v
  }
  return value
}

type ToMapResult<T> = { [K in string]: T }

export function toMap<T extends object>(list: T[], field: keyof T): ToMapResult<T> {
  const m: ToMapResult<T> = {}
  for (let i of list) {
    let key = i[field] as any as string
    m[key] = i
  }
  return m
}

export function updateOrPush<T extends object>(list: T[], item: T, lookup: keyof T): T[] {
  const newList = [...list]
  let updated = false
  for (let i = 0; i < list.length; i++) {
    if (newList[i][lookup] === item[lookup]) {
      newList[i] = item
      updated = true
      break
    }
  }
  if (!updated) {
    newList.push(item)
  }
  return newList
}


export function equal(t1: any, t2: any): boolean {
  return JSON.stringify(t1) === JSON.stringify(t2)
}
