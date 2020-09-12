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
