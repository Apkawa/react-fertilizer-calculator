# a11y — спецификация

Источник: [draft.md](./draft.md). Исследования: [research.md](./research.md).

## Цель

Подготовить интерфейс приложения к доступности:

- (а) добавить автоматические a11y-тесты (Playwright + `@axe-core/playwright`) в e2e-свит;
- (б) расставить `aria-label` и другие необходимые атрибуты доступности **по всему приложению**,
  чтобы у контролов появились стабильные, предсказуемые доступные имена.

Польза: воспроизводимые a11y-проверки + **навигация через playwright-cli становится заметно проще**
(сегодня e2e и playwright-cli упираются в «хрупкие» локейторы `div:has(> svg)`, `xpath=…//svg`,
`ancestor::div[1]//button` — иконочные кнопки без имён).

## Объём

Всё приложение: все страницы/маршруты и все интерактивные компоненты
(`packages/icons`, `packages/ui`, app-level form-компоненты).

## Что есть сейчас (результаты research — фактическая база)

- `aria-label` в source-дереве ровно в 2 местах (спиннеры `NumberInput`); диалоговые роли,
  `aria-modal`, `aria-expanded`, `aria-pressed` и т.п. — **нигде**.
- `IconButton` — нативная кнопка, но icon-only использования **без видимого текста → без доступного имени**.
- Кликабельные **`<div>`** с `onClick` (не кнопки): `Icon` в `ColorModeToggle`, шеврон `Dropdown`,
  close в `Modal`/`Sidebar`, оверлей `Sidebar` — нарушает семантику (и Biome `noStaticElementInteractions`).
- `Modal`: портал в `#modal-root`, **нет** `role="dialog"`, `aria-modal`, `aria-labelledby`,
  управления фокусом (ни `autoFocus`, ни focus-restore).
- `Dropdown`: триггер — `<input type="text">` без combobox-семантики (`role`, `aria-expanded`);
  список уже `role="listbox"`/`role="option"`.
- App-level `Form/Input`: `label` проп используется **только как placeholder** — доступного имени нет.
- `@axe-core/playwright` **не установлен**; `@playwright/test` 1.62.1 (root devDep).
- Tесты: один `playwright.config.ts`, smoke/e2e по подпапкам, `webServer` = `pnpm start` (:3000),
  HashRouter-URL (`/#/…`), `workers: 1`. Никакой тест **не открывает Modal** (только Sidebar).
- e2e/smoke **не входят** в `full-check`/CI (локальный прогон), но Biome (a11y recommended,
  `useButtonType`/`useAltText: error`) **проверять** правки в `apps/` и `packages/`.

## План работ (суть; детально — в plan.md)

### 1. a11y-тесты в e2e (TDD: сначала красный)

- Добавить `@axe-core/playwright` в root `package.json` devDeps (рядом с `@playwright/test`), `pnpm install`.
- Новые **отдельные тест-кейсы a11y внутри e2e** (`tests/e2e/a11y*.test.ts`):
  - axe-скан (`AxeBuilder`, теги `wcag2a` + `wcag2aa`) по всем основным маршрутам
    (`/`, `/fertilizers`, `/formula/…`, `/density/…`, `/example`, `/help/…`);
  - **скан в состояниях с открытыми элементами**: открыть модалку (триггер — icon-кнопка),
    dropdown, sidebar (узкая ширина) — и прогнать axe в открытом состоянии
    (закрытие по `Escape`/оверлею проверяется инцидентно);
  - падение при `violations ≠ []` (с выводом нарушений в отчёт).
- Это же тест-кейсы сразу дают «красный» старт TDD для фикса.

### 2. Атрибуты доступности по проекту (пока сканы зелёные)

- **Icon-only `IconButton`** — доступные имена: `aria-label` на каждом icon-only использовании
  (KISS: атрибут на стороне вызова; DRY: при большом числе однотипных — проп у компонента).
- **Кликабельные `<div>` → настоящие кнопки**: close в `Modal`/`Sidebar`, шеврон `Dropdown`,
  `ColorModeToggle` (плюс `aria-pressed`), оверлей `Sidebar` (останется surface с biome-ignore — осознанно).
- **`Modal`**: `role="dialog"`, `aria-modal="true"`, `aria-labelledby` на заголовок `<h2>`,
  фокус при открытии + возврат фокуса на триггер при закрытии.
  (Полный focus-trap с роверным фокусом — **out of scope**: axe-auto-проверки его не требуют,
   KISS; `aria-modal` уже сообщает ассистивным техникам о «запертом» диалоге.)
- **`Dropdown`**: `role="combobox"` + `aria-expanded`/`aria-controls` на триггере,
  связать с открытым `listbox` (по минимуму, что просит axe-auto); шеврон — кнопка.
- **App-level `Form/Input`**: `aria-label` из `label` пропа (помимо placeholder).
- Остальные findings axe-сканов по ходу (заголовки, контраст и т.п.) — чинить по факту
  «красного», не выдумывая список заранее.

## Критерий приёмки

1. `pnpm test:e2e` (a11y-тест-кейсы): **`violations === []`** на всех основных маршрутах **и**
   в состояниях с открытыми модалками/dropdown/sidebar.
2. `pnpm full-check` зелёный (test + lint + type + build) — Biome a11y-правила не ругаются.
3. Навигация через playwright-cli заметно проще: иконочные кнопки/контролы адресуются
   по `getByRole("button", { name: … })` без хрупких DOM-локейторов; хрупкие локейторы
   в существующих e2e-тестах (`div:has(> svg)` и др.) заменены на role-based по возможности.

## Открытые вопросы / решения

- **Глубина фокус-менеджмента** — решение: минимум (фокус при открытии + возврат), без full trap (KISS,
  не требуется axe-auto; зафиксировано как out of scope).
- **Формат a11y-тестов** — решение: отдельные тест-кейсы внутри `tests/e2e/` (по уточнению пользователя),
  включая сценарии «элемент открыт → скан».
- **Структура**: тесты не линтятся Biome (`tests/` вне scope) — ok; новые `aria-label` в `apps/`/`packages/` — линтятся.
- **CI**: a11y-тесты, как и весь Playwright, локальные (не в `full-check`) — фиксируем, не меняем.
- **React 16**: axe через Playwright — runtime-инжекция, совместимо; императивного API модалок нет —
  в тестах открываем модалки кликом по триггеру.
