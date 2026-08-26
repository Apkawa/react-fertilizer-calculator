# Спецификация: починить Help и CSV после миграции на Vite

## Контекст

После миграции со CRA на Vite две фичи не работают:

1. **Справка** (`src/pages/Help`) — страница белая, в консоли
   `TypeError: Object prototype may only be an Object or null` из чанка `react-markdown@4`.
2. **Импорт/экспорт CSV** (`src/utils/csv.ts`) — осознанная заглушка: оба метода бросают
   «временно отключён» (старые `csv-parse@4`/`csv-stringify@5` — CJS на `Buffer`,
   который Vite в браузер не подставляет).

Сборка (`pnpm build`) и типы (`pnpm type`) проходят — обе проблемы чисто runtime/зависимости.

## Цели

- Страницы Help рендерят markdown **и** сырой HTML (таблица опасности в
  `safety/chem_table.md` с `<span style=...>`/`<br>`), картинки из `docs/<slug>/` работают.
- Импорт/экспорт CSV работают в браузере: парсинг файла в fertilizer'ы, экспорт профилей
  и удобрений в CSV (те же форматы, что до миграции).
- `pnpm full-check` (test + lint + type + build) зелёный; smoke-проверка в браузере.

## Ограничения

- React 16 остаётся (upgrading вне scope) → **react-markdown ≤ v8**
  (v9+ требует React ≥18). Выбран `react-markdown@^8.0.7` (ESM, peer `react >=16`).
- TypeScript 7 strict; пакеты без типов не используются.
- Библиотеки: не вводим новые UI-библиотеки; не трогаем `src/calculator`.

## Изменения

### 1. Help (react-markdown 4.3.1 → 8.0.7)

Зависимости:
- `react-markdown` → `^8.0.7`;
- новые: `rehype-raw@^6`, `rehype-sanitize`, `hast-util-sanitize` (рендер raw-HTML + свой schema).

`src/pages/Help/Help.tsx`:
- `import ReactMarkdown from "react-markdown/with-html"` → `from "react-markdown"`;
- `source={result}` → `children={result}`;
- убрать `escapeHtml` (в v8 отсутствует);
- `rehypePlugins={[rehypeRaw, [rehypeSanitize, schema]]}` — `schema` расширяет
  `defaultSchema` разрешением атрибута `style` (иначе цвета в chem_table будут отброшены
  санитайзером — риск R1);
- `transformImageUri` остаётся (v8 поддерживает; маппинг `./docs/<slug>/`).

`src/pages/Help/pages.ts` не меняется (`?raw` уже работает).

### 2. CSV (csv-parse 4.12.0 → 7.0.2, csv-stringify 5.5.1 → 6.8.3)

Зависимости:
- `csv-parse` → `^7.0.2`, `csv-stringify` → `^6.8.3` (ESM + browser, без `Buffer`, со своими типами);
- удалить неиспользуемый пакет `csv@5.3.2` (в src ни одного импорта).

`src/utils/csv.ts` — заменить заглушку на настоящие импорты:
- `import { parse } from "csv-parse/browser/esm/sync"`;
- `import { stringify } from "csv-stringify/browser/esm/sync"`;
- сигнатуры `csvParse` / `csvExport` сохраняют имена и поведение для 4 компонентов
  (`{columns: string[]}`, `{columns, header: true}`) — потребители не меняются.

### 3. Тесты (TDD)

- `src/utils/__tests__/csv.test.ts`: парсинг (columns, пропуска заголовка — как делает
  `ImportFertilizers`), экспорт (header + columns), round-trip.
- `src/__tests__/markdown.test.tsx` (или рядом в pages/Help): рендер
  `react-markdown` v8 над `src/docs/safety/chem_table.md?raw` → `<table>` с `<span>` и
  `style` на месте (проверка schema); плюс короткий md с картинкой → `transformImageUri`
  мапит путь в `./docs/...`.

## Не в scope

- Upgrade React 16 → 18 (блокирует react-markdown v9+; отдельная задача).
- Изменение форматов CSV, UX ImportExport, путей страниц Help.
- Изменения `vite.config.ts` (по текущим данным не требуются).

## Критерии приёмки

1. В браузере (production-сборка): `#/help/how_to_use` и `#/help/safety/chem_table`
   рендерятся; в chem_table видны цветные `<span>` и `<br>`; консоль без ошибок.
2. Импорт CSV (кнопка в Калькуляторе): файл формата «Удобрения.csv» загружает удобрения;
   экспорт «Профили.csv»/«Удобрения.csv» скачивает корректный CSV (header + строки).
3. `pnpm full-check` зелёный; новые тесты зелёные.
4. `node_modules`-бандл Help-чанка больше не содержит CJS-`inherits`/`Buffer` из старых версий.
