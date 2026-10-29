import { expect, test } from "@playwright/test";
import { trackConsoleErrors } from "../helpers";

// Smoke: каждый главный маршрут грузится без ошибок консоли/страницы
// и показывает характерный маркер страницы. Поведение не проверяем —
// только «маршрут жив».
//
// Маршруты — HashRouter (/#/…), как в реальном приложении.
// Экран /#/fertilizers убран: merged-карточка «Удобрения» на странице
// калькулятора (канон §3.1) — её маркер проверяем на /#/ (строка
// библиотеки рендерит id удобрения).

type RouteCase = {
  name: string;
  url: string;
  // Регулярки по тексту, уникальному для этой страницы.
  markers: RegExp[];
};

const routes: RouteCase[] = [
  {
    name: "calculator",
    url: "/#/",
    markers: [/Результат расчета/, /Нитрат аммония \(NH4NO3\)/],
  },
  { name: "chem formula parser", url: "/#/formula/NaCl", markers: [/Атомная масса/] },
  { name: "density calculator", url: "/#/density/NaCl/", markers: [/Калькулятор плотности/] },
  { name: "help", url: "/#/help/how_to_use", markers: [/Расчет растворов для гидропоники/] },
  // NotFound (pages/NotFound) на самом деле недостижим: Route path="/" в Root.tsx
  // матчит любой путь раньше catch-all. Известная особенность приложения — smoke здесь
  // проверяет, что неизвестный URL не роняет shell.
  {
    name: "not found (unreachable page, shell alive)",
    url: "/#/definitely-not-a-page",
    // Маркер shell-обвязки — футер версии (рендерится всегда, независимо от
    // страницы и ширины; fork-баннер из header убран).
    markers: [/\d+\.\d+\.\d+-/],
  },
];

for (const route of routes) {
  test(`smoke: ${route.name}`, async ({ page }) => {
    const errors = trackConsoleErrors(page);

    await page.goto(route.url);
    for (const marker of route.markers) {
      await expect(page.getByText(marker).first()).toBeVisible();
    }

    expect(errors(), `console/page errors: ${errors().join("\n")}`).toEqual([]);
  });
}
