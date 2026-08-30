import { expect, test, type Page } from "@playwright/test";
import { AxeBuilder } from "@axe-core/playwright";
import type { AxeResults } from "axe-core";

// E2E: a11y — axe-core (AxeBuilder, теги wcag2a + wcag2aa) скан основных маршрутов
// и состояний с открытыми оверлеями (модалка, дропдаун, сайдбар).
//
// Красный базис a11y-задачи: в текущем коде есть нарушения (иконные кнопки без
// доступных имён, кликабельные <div>, нет диалоговой/combobox-семантики),
// поэтому тесты ожидаемо ПАДАЮТ, пока не сделаны фиксы (stages 2-4 плана).
//
// Локейторы иконочных контролов ниже хрупкие (доступных имён ещё нет) — это
// приемлемо для этой ступени, в stage 5 они заменяются role-based
// (сложены в хелперы ниже, чтобы менять было в одном месте).

const A11Y_TAGS = ["wcag2a", "wcag2aa"];

type RouteCase = {
  name: string;
  url: string;
  // Текст, уникальный для страницы: страница готова, когда он виден.
  marker: string;
};

// Маршруты — как в smoke (tests/smoke/routes.test.ts): HashRouter (/#/…).
const routes: RouteCase[] = [
  { name: "calculator", url: "/#/", marker: "Результат расчета" },
  { name: "fertilizer manager", url: "/#/fertilizers", marker: "Нитрат аммония (NH4NO3)" },
  { name: "chem formula parser", url: "/#/formula/NaCl", marker: "Атомная масса" },
  { name: "density calculator", url: "/#/density/NaCl/", marker: "Калькулятор плотности" },
  { name: "example", url: "/#/example", marker: "On the other hand, we denounce" },
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
// Хрупкие иконочные локейторы (доступных имён ещё нет) — в одном месте,
// stage 5 заменит на getByRole("button", { name }).

// «Добавить удобрение» в FertilizerManager — icon-only IconButton:
// первая кнопка страницы (стоит выше всех остальных контролов).
function addFertilizerTrigger(page: Page) {
  return page.locator("button").first();
}

// Бургер (открывает сайдбар) — первый div с единственным svg-ребёнком,
// тот же локейтор, что и в navigation.test.ts.
function hamburger(page: Page) {
  return page.locator("div:has(> svg)").first();
}

// Шеврон дропдауна (открывает список) — svg в обёртке триггера,
// тот же паттерн, что и в shared.ts (addFertilizers).
function dropdownChevron(page: Page) {
  const input = page.locator('input[type="text"]').first();
  return input.locator("xpath=..").locator("svg");
}

test("a11y: open modal (fertilizer manager add)", async ({ page }) => {
  await openReadyPage(page, "/#/fertilizers", "Нитрат аммония (NH4NO3)");
  await addFertilizerTrigger(page).click();
  // Модалка рендерится порталом в #modal-root — ждём оверлей.
  await expect(page.locator("#modal-root > div").first()).toBeVisible();
  expectNoViolations("open modal", await analyzePage(page));
});

test("a11y: open dropdown (example page)", async ({ page }) => {
  await openReadyPage(page, "/#/example", "On the other hand, we denounce");
  // Список открывает шеврон (клик по самому input список не открывает).
  // Шеврон на этой странице закрыт ленточкой "Fork me on GitHub"
  // (position:absolute, z-index:100, покрывает правый верхний угол документа) —
  // реальный клик перехватывает span-обёртка ленты, поэтому список открываем
  // диспатчем события на саму иконку (здесь проверяем состояние открытого
  // списка, а не кликабельность шеврона).
  await dropdownChevron(page).dispatchEvent("click");
  await expect(page.locator('[role="listbox"]')).toBeVisible();
  expectNoViolations("open dropdown", await analyzePage(page));
});

test.describe("open sidebar", () => {
  // При ширине < 1024px сайдбар не докнутый: открывается бургером.
  test.use({ viewport: { width: 800, height: 600 } });

  test("a11y: open sidebar (narrow viewport)", async ({ page }) => {
    await openReadyPage(page, "/#/", "Результат расчета");
    await hamburger(page).click();
    // Открытый сайдбар рендерится порталом в #sidebar-root — ждём оверлей.
    await expect(page.locator("#sidebar-root > div").first()).toBeVisible();
    expectNoViolations("open sidebar", await analyzePage(page));
  });
});
