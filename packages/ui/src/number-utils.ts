// Портировано из packages/calculator/src/utils.ts — мелкие чистые утилиты
// округления, используемые числовым инпутом (UI-слой не должен зависеть
// от пакета вычислений, поэтому копия).
export function round(number: number, precision = 0): number {
  const p = 10 ** precision;
  return Math.round((number + Number.EPSILON) * p) / p;
}

export function countDecimals(value: number): number {
  if (Math.floor(value.valueOf()) === value.valueOf()) {
    return 0;
  }
  return value.toString().split(".")[1]?.length || 0;
}
