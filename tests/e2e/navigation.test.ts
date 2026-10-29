import { expect, test, type Page } from "@playwright/test";
import { trackConsoleErrors } from "../helpers";

// E2E: навигация по сайдбару — каждое меню ведёт на живую страницу.
// Проверяем только «переход + маркер страницы», поведение страниц не трогаем.

// Docked-сайдбар (порог канона §2.1 — 1250px): фиксируем ширину явно,
// чтобы состояние «докнут» не зависело от дефолта конфига.
test.use({ viewport: { width: 1280, height: 800 } });

test("navigation: sidebar links lead to live pages", async ({ page }) => {
  const errors = trackConsoleErrors(page);
  await page.goto("/#/");
  await expect(page.getByText("Результат расчета").first()).toBeVisible();

  // Сайдбар при ≥1250px докнут (fixed-панель из портала #sidebar-root):
  // бургера «Меню» нет (триггер не рендерится), ссылки видны сразу и
  // панель не закрывается после перехода — поэтому кликаем напрямую.
  const clickSidebarLink = async (tab: string) => {
    await page.getByRole("link", { name: tab }).click();
  };

  // Вкладка «Удобрения» убрана из сайдбара: отдельный экран /fertilizers
  // больше нет — merged-карточка на странице калькулятора (канон §3.1).
  const steps: { tab: string; marker: RegExp }[] = [
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
