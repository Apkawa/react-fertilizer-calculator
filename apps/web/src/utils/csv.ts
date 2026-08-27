import { parse } from "csv-parse/browser/esm/sync";
import { stringify } from "csv-stringify/browser/esm/sync";

// Браузерные сборки csv-parse/csv-stringify (dist/esm) self-contained: собственный
// минимальный Buffer-полифилл инлайнован, node-`Buffer` не требуется — работают
// в браузерном бандле Vite (старые `lib/sync` тянули node-`Buffer`, которого в
// браузере нет).
export type CsvRecord = Record<string, any>;
export type CsvOptions = Record<string, unknown>;

export const csvParse = (csv: string, options?: CsvOptions): CsvRecord[] =>
  parse(csv, options as never) as CsvRecord[];

export const csvExport = (rows: unknown[], options?: CsvOptions): string =>
  stringify(rows, options as never) as string;
