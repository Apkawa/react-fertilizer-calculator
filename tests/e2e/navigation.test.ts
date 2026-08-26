import { expect, test, type Page } from "@playwright/test";
import { trackConsoleErrors } from "../helpers";

// E2E: навигация по сайдбару — каждое меню ведёт на живую страницу.
// Проверяем только «переход + маркер страницы», поведение страниц не трогаем.

test("navigation: sidebar links lead to live pages", async ({ page }) => {
  const errors = trackConsoleErrors(page);
  await page.goto("/#/");
  await expect(page.getByText("Результат расчета").first()).toBeVisible();

  // Сайдбар: при ширине < 1650px не докнутый — открывается бургером
  // (первый на странице div с единственным svg-ребёнком).
  // Открытый сайдбар рендерится порталом в #sidebar-root; клик по любой ссылке
  // всплывает в overlay и закрывает сайдбар (поведение оверлея) —
  // поэтому перед каждым шагом открываем его заново.
  const hamburger = page.locator("div:has(> svg)").first();
  const clickSidebarLink = async (tab: string) => {
    await hamburger.click();
    await page.getByRole("link", { name: tab }).click();
  };

  const steps: { tab: string; marker: RegExp }[] = [
    { tab: "Удобрения", marker: /Нитрат аммония \(NH4NO3\)/ },
    { tab: "Парсер формул", marker: /Атомная масса/ },
    { tab: "Плотность", marker: /Калькулятор плотности/ },
    { tab: "Как использовать", marker: /Расчет растворов для гидропоники/ },
    { tab: "Калькулятор", marker: /Результат расчета/ },
  ];

  for (const { tab, marker } of steps) {
    await clickSidebarLink(tab);
    await expect(page.getByText(marker).first()).toBeVisible();
  }

  expect(errors(), `console/page errors: ${errors().join("\n")}`).toEqual([]);
});
