// Общие утилиты расчётного ядра (до расщепления — apps/web/src/utils/index.ts).
// Приложение реэкспортирует эти функции из пакета, импорты приложения не меняются.

export const keys = Object.keys as <T>(o: T) => Extract<keyof T, string>[];

export const entries = Object.entries as <T>(
  o: T,
) => [Extract<keyof T, string>, Exclude<T[keyof T], undefined>][];

export const values = Object.values as <T>(o: T) => Exclude<T[keyof T], undefined>[];

export function sum(values: number[]) {
  return values.reduce((a, b) => a + b, 0);
}

export function round(number: number, precision: number = 0) {
  const p = 10 ** precision;
  return Math.round((number + Number.EPSILON) * p) / p;
}

export function countDecimals(value: number): number {
  if (Math.floor(value.valueOf()) === value.valueOf()) return 0;
  return value.toString().split(".")[1].length || 0;
}

export function tryParseFloat(value: string): number | string {
  const v = parseFloat(value);
  if (!isNaN(v)) {
    return v;
  }
  return value;
}
