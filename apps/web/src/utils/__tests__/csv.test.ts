// Red-тест: целевой контракт = браузерные csv-parse/csv-stringify (без node-`Buffer`).
// Под текущим стабом `csv.ts` обе функции кидут exception ("временно отключён") —
// эти ассерты не выполняются.
import { csvExport, csvParse } from "@/utils/csv";

test("csvParse: разбирает строки по имени колонок (header skip как в ImportFertilizers)", () => {
  // строка 1 — заголовок (P не число), строка 2 — значения
  const csv = 'id,P,K\n"Urea",18,0\n';
  const p = csvParse(csv, { columns: ["id", "P", "K"] });
  // потребитель выбрасывает строку-заголовок
  if (isNaN(parseInt(p[0].P))) {
    p.splice(0, 1);
  }
  expect(p.length).toBe(1);
  expect(p[0]).toEqual({ id: "Urea", P: "18", K: "0" });
});

test("csvExport + csvParse: round-trip с header", () => {
  const rows = [
    ["A", "18", "0"],
    ["B", "10", "5"],
  ];
  const csv = csvExport(rows, { columns: ["id", "P", "K"], header: true });
  // первая строка — имена колонок
  const lines = csv.trim().split(/\r?\n/);
  expect(lines[0]).toBe("id,P,K");
  const parsed = csvParse(csv, { columns: ["id", "P", "K"] });
  parsed.splice(0, 1); // заголовок
  expect(parsed).toEqual([
    { id: "A", P: "18", K: "0" },
    { id: "B", P: "10", K: "5" },
  ]);
});
