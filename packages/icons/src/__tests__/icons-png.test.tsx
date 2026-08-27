import { execFileSync } from "child_process";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, writeFileSync } from "fs";
import { tmpdir } from "os";
import path from "path";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { fileURLToPath } from "url";
import { type IconName, icons } from "../registry";

/**
 * PNG-превью иконок из реестра (визуальная регрессия без браузера).
 *
 * Каждая иконка из `registry.ts` рендерится в SVG (сетка 24×24, чёрный),
 * `rsvg-convert` (системный, librsvg) конвертирует её в PNG, результат
 * сравнивается побайтово с базлайном `__tests__/snapshots/icons/<имя>.png`.
 *
 * Базлайна ещё нет — PNG сохраняется (как снапшот), тест проходит.
 * Обновить базлайны (изменение иконки одобрено): `UPDATE_ICON_PNGS=1 pnpm -C packages/icons test`.
 * Прогнать только свои иконки (регрессия по каждой): `ICON_PNG_FILTER=plus,close pnpm -C packages/icons test`.
 * `rsvg-convert` не установлен — блок целиком пропускается, тесты проходят.
 */

/** Увеличение рендера: сетка 24×24 → 96×96 px, иконка читается глазом. */
const SCALE = 4;

/** Базлайны PNG, коммитятся в репозиторий. */
const SNAPSHOT_DIR = path.join(path.dirname(fileURLToPath(import.meta.url)), "snapshots", "icons");

const ALL_NAMES: IconName[] = Object.keys(icons).sort();

/** UPDATE_ICON_PNGS=1 — перезаписать базлайны без сравнения. */
const UPDATE = process.env.UPDATE_ICON_PNGS === "1";

/** ICON_PNG_FILTER=имя,имя — только эти иконки (пусто — все). */
const FILTER: string[] | null = process.env.ICON_PNG_FILTER
  ? process.env.ICON_PNG_FILTER.split(",")
      .map((s) => s.trim())
      .filter(Boolean)
  : null;
const RUN_NAMES: IconName[] = FILTER ? ALL_NAMES.filter((n) => FILTER.includes(n)) : ALL_NAMES;

/** Системный rsvg-convert; без него блок пропускается (например, в CI). */
const HAS_RSVG = (() => {
  try {
    execFileSync("rsvg-convert", ["--version"], { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
})();

/** Иконка → автономная svg-разметка (xmlns обязателен, чтобы rsvg прочитал файл). */
function iconSvgMarkup(name: IconName): string {
  const Cmp = icons[name];
  const markup = renderToStaticMarkup(<Cmp size={24} color="black" />);
  return markup.replace("<svg ", '<svg xmlns="http://www.w3.org/2000/svg" ');
}

/**
 * Рендерит иконку и конвертирует в PNG через rsvg-convert.
 * Возвращает байты PNG и путь к файлу (для диффа при провале).
 */
function renderPng(name: IconName, workdir: string): { png: Buffer; pngPath: string } {
  const svgPath = path.join(workdir, `${name}.svg`);
  const pngPath = path.join(workdir, `${name}.png`);
  writeFileSync(svgPath, iconSvgMarkup(name), "utf8");
  execFileSync(
    "rsvg-convert",
    ["--format", "png", "--zoom", String(SCALE), "--output", pngPath, svgPath],
    {
      stdio: "pipe",
    },
  );
  return { png: readFileSync(pngPath), pngPath };
}

/**
 * Рабочая папка с промежуточными svg/png.
 * Не чистим: при провале там лежит свежий PNG для сравнения с базлайном.
 */
const WORKDIR = mkdtempSync(path.join(tmpdir(), "icons-png-"));

describe.skipIf(!HAS_RSVG)("icons: PNG-превью иконок из реестра (rsvg-convert)", () => {
  test("ICON_PNG_FILTER содержит только имена из реестра", () => {
    if (!FILTER) return;
    const unknown = FILTER.filter((n) => !(ALL_NAMES as string[]).includes(n));
    expect(
      unknown,
      `Имя иконки из ICON_PNG_FILTER не в реестре (известны: ${ALL_NAMES.join(", ")})`,
    ).toEqual([]);
  });

  test.each(RUN_NAMES)(
    "иконка %s: PNG совпадает с базлайном (или базлайн создаётся)",
    (name: IconName) => {
      const { png, pngPath } = renderPng(name, WORKDIR);
      const baselinePath = path.join(SNAPSHOT_DIR, `${name}.png`);
      if (UPDATE || !existsSync(baselinePath)) {
        mkdirSync(SNAPSHOT_DIR, { recursive: true });
        writeFileSync(baselinePath, png);
        return;
      }
      const baseline = readFileSync(baselinePath);
      if (png.toString("hex") !== baseline.toString("hex")) {
        throw new Error(
          `Иконка «${name}» изменилась. Свежий PNG: ${pngPath}, базлайн: ${baselinePath}. ` +
            `Если изменение запланировано, обновите базлайн: UPDATE_ICON_PNGS=1 pnpm -C packages/icons test`,
        );
      }
    },
  );
});

test.skipIf(HAS_RSVG)("rsvg-convert не установлен — PNG-тесты иконок пропущены", () => {
  // Никогда не выполняется: служебный тест, чтобы пропуск было видно в отчёте.
});
