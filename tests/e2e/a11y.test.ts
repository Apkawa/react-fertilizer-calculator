import { expect, test, type Page } from "@playwright/test";
import { AxeBuilder } from "@axe-core/playwright";
import type { AxeResults } from "axe-core";

// E2E: a11y — axe-core (AxeBuilder, теги wcag2a + wcag2aa) скан основных маршрутов
// и состояний с открытыми оверлеями (модалка, сайдбар).
//
// Красный базис a11y-задачи: в текущем коде есть нарушения (иконные кнопки без
// доступных имён, кликабельные <div>, нет диалоговой/combobox-семантики),
// поэтому тесты ожидаемо ПАДАЮТ, пока не сделаны фиксы (stages 2-4 плана).
//
// Локейторы иконочных контролов сложены в хелперы ниже, чтобы менять было
// в одном месте (stage 5 — финальная расчистка хрупких локейторов по проекту).
// После stage 2 это уже role-based: у иконочных контролей есть доступные имена.

const A11Y_TAGS = ["wcag2a", "wcag2aa"];

type RouteCase = {
  name: string;
  url: string;
  // Текст, уникальный для страницы: страница готова, когда он виден.
  marker: string;
};

// Маршруты — как в smoke (tests/smoke/routes.test.ts): HashRouter (/#/…).
// Экран /#/fertilizers убран: merged-карточка «Удобрения» на странице
// калькулятора (канон §3.1).
const routes: RouteCase[] = [
  { name: "calculator", url: "/#/", marker: "Результат расчета" },
  { name: "chem formula parser", url: "/#/formula/NaCl", marker: "Атомная масса" },
  { name: "density calculator", url: "/#/density/NaCl/", marker: "Калькулятор плотности" },
  { name: "help", url: "/#/help/how_to_use", marker: "Расчет растворов для гидропоники" },
];

// Готовность страницы = видимости маркера (паттерн существующих тестов).
async function openReadyPage(page: Page, url: string, marker: string) {
  await page.goto(url);
  await expect(page.getByText(marker).first()).toBeVisible();
}

async function analyzePage(page: Page) {
  return new AxeBuilder({ page }).withTags(A11Y_TAGS).analyze();
}

// Читаемое падение: строка на каждый node нарушения —
// rule id, impact, help, target (CSS-путь к элементу).
function expectNoViolations(label: string, results: AxeResults) {
  const violations = results.violations.flatMap((v) =>
    v.nodes.map((n) => `${v.id} [${v.impact}] ${v.help} — target: ${n.target.join(" ")}`),
  );
  expect(violations, `a11y violations (${label}):\n${violations.join("\n")}`).toEqual([]);
}

for (const route of routes) {
  test(`a11y: route ${route.name}`, async ({ page }) => {
    await openReadyPage(page, route.url, route.marker);
    expectNoViolations(route.name, await analyzePage(page));
  });
}

// ── Состояния с открытыми оверлеями ────────────────────────────────────────────────────
// Иконочные контролы адресуются по доступному имени (stage 2) — role-based
// хелперы в одном месте, stage 5 пройдёт по ним финальную расчистку.

// Плюс в шапке merged-карточки «Удобрения» (канон §3.1) — icon-only
// IconButton с доступным именем «Добавить удобрение», открывает модалку
// AddEdit на странице калькулятора /#/.
function addFertilizerButton(page: Page) {
  return page.getByRole("button", { name: "Добавить удобрение" });
}

// Бургер (открывает сайдбар) — кнопка с именем «Меню».
function hamburger(page: Page) {
  return page.getByRole("button", { name: "Меню" });
}

test("a11y: open modal (fertilizer add via merged card header)", async ({ page }) => {
  await openReadyPage(page, "/#/", "Результат расчета");
  await addFertilizerButton(page).click();
  // Модалка рендерится порталом в #modal-root — ждём открытый диалог
  // (role=dialog, stage 3) и реально открытый контент (кнопка «Save» из
  // контейнера модалки), чтобы axe не сканировал закрытое состояние.
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(page.getByRole("button", { name: "Save" })).toBeVisible();
  // Поле id формы AddEdit — input с доступным именем «Name» (label-проп).
  await page.getByRole("textbox", { name: "Name" }).fill("Тестовое удобрение (NH4NO3)");
  expectNoViolations("open modal", await analyzePage(page));
  // Сохранение закрывает модалку и добавляет ряд в библиотеку карточки.
  await page.getByRole("button", { name: "Save" }).click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(
    page.getByRole("checkbox", { name: "Выбрать Тестовое удобрение (NH4NO3)" }),
  ).toBeVisible();
});

test.describe("open sidebar", () => {
  // При ширине < 1250px (порог канона §2.1) сайдбар — drawer: открывается бургером.
  test.use({ viewport: { width: 390, height: 800 } });

  test("a11y: open sidebar (narrow viewport)", async ({ page }) => {
    await openReadyPage(page, "/#/", "Результат расчета");
    await hamburger(page).click();
    // Открытый сайдбар рендерится порталом в #sidebar-root — ждём оверлей
    // и реально открытый контент (тумблер темы — внутри открытого сайдбара),
    // чтобы axe не сканировал закрытое состояние.
    await expect(page.locator("#sidebar-root > div").first()).toBeVisible();
    await expect(page.getByRole("button", { name: "Переключить тему" })).toBeVisible();
    expectNoViolations("open sidebar", await analyzePage(page));
  });
});
