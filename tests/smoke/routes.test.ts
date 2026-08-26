import { expect, test } from "@playwright/test";

// Smoke: каждый главный маршрут грузится без ошибок консоли/страницы
// и показывает характерный маркер страницы. Поведение не проверяем —
// только «маршрут жив».
//
// Маршруты — HashRouter (/#/…), как в реальном приложении.

// Dev-предупреждения React 16 про legacy lifecycles — их шлют redux-form
// (Form/Field/FieldArray) на странице калькулятора. Шум либы, не ошибки приложения.
const isKnownDevWarning = (text: string) => text.startsWith("Warning: Using UNSAFE_");

type RouteCase = {
  name: string;
  url: string;
  // Регулярка по тексту, который уникален для этой страницы.
  marker: RegExp;
};

const routes: RouteCase[] = [
  { name: "calculator", url: "/#/", marker: /Результат расчета/ },
  {
    name: "fertilizer manager",
    url: "/#/fertilizers",
    marker: /Нитрат аммония \(NH4NO3\)/,
  },
  { name: "chem formula parser", url: "/#/formula/NaCl", marker: /Атомная масса/ },
  { name: "density calculator", url: "/#/density/NaCl/", marker: /Калькулятор плотности/ },
  { name: "example", url: "/#/example", marker: /On the other hand, we denounce/ },
  { name: "help", url: "/#/help/how_to_use", marker: /Расчет растворов для гидропоники/ },
  // NotFound (pages/NotFound) на самом деле недостижим: Route path="/" в Root.tsx
  // матчит любой путь раньше catch-all. Известная особенность приложения — smoke здесь
  // проверяет, что неизвестный URL не роняет shell.
  { name: "not found (unreachable page, shell alive)", url: "/#/definitely-not-a-page", marker: /Fork me on GitHub/ },
];

for (const route of routes) {
  test(`smoke: ${route.name}`, async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (m) => {
      if (m.type() === "error" && !isKnownDevWarning(m.text())) errors.push(m.text());
    });
    page.on("pageerror", (e) => errors.push(String(e)));

    await page.goto(route.url);
    await expect(page.getByText(route.marker).first()).toBeVisible();

    expect(errors, `console/page errors: ${errors.join("\n")}`).toEqual([]);
  });
}
