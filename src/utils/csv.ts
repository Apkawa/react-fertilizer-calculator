/**
 * Заглушки: csv-parse/csv-stringify временно отключены (миграция сборки на Vite).
 * Библиотеки используют node-`Buffer`, которого нет в браузерной сборке Vite.
 * Как включить обратно: вернуть импорты `csv-parse/lib/sync` / `csv-stringify/lib/sync`
 * плюс глобальный полифилл `Buffer` в браузер (старый webpack 4 встраивал его сам).
 */

export type CsvRecord = Record<string, any>
export type CsvOptions = Record<string, unknown>

const disabled = (kind: string): never => {
  throw new Error(`CSV: ${kind} временно отключён (миграция на Vite)`)
}

export const csvParse = (_csv: string, _options?: CsvOptions): CsvRecord[] => disabled('import')
export const csvExport = (_rows: unknown[], _options?: CsvOptions): string => disabled('export')
