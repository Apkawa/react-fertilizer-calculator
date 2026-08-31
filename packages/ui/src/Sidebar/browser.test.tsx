// Браузерный регрессионный тест Sidebar (vitest browser mode, chromium).
// Portal: SidebarContainer рендерится в #sidebar-root (вне container) —
// панель ищем page-локаторами (getByRole по заголовку/кнопкам).
// viewport 1280×720: 1024 < 1280 ≤ 1650 — сайдбар НЕ докнут, есть кнопка закрытия.
import React from "react";
import { expect, test } from "vitest";
import { page } from "vitest/browser";
import { mountBrowser } from "../browser-test-utils";
import { Sidebar } from "./index";

// Реальный паттерн использования: дефолтный бургер-триггер, контент — children
function BaseSidebar() {
  return (
    <Sidebar title="Тестовый сайдбар">
      <div>содержимое сайдбара</div>
    </Sidebar>
  );
}

test("Sidebar: бургер открывает панель, кнопка «Закрыть» закрывает", async () => {
  const { screen } = mountBrowser(<BaseSidebar />);
  const burger = screen.getByRole("button", { name: "Меню" });
  await expect.element(burger).toBeVisible();
  await burger.click();

  // Портальная панель: заголовок, контент, контрол закрытия
  const title = page.getByRole("heading", { name: "Тестовый сайдбар" });
  await expect.element(title).toBeVisible();
  await expect.element(page.getByText("содержимое сайдбара")).toBeVisible();
  const closeButton = page.getByRole("button", { name: "Закрыть" });
  await expect.element(closeButton).toBeVisible();

  // Закрытие кнопкой: портал размонтируется
  await closeButton.click();
  await expect.element(title).not.toBeInTheDocument();
});

test("Sidebar: ARIA-снапшот базового состояния (закрыто — только бургер)", async () => {
  const { screen } = mountBrowser(<BaseSidebar />);
  await expect.element(screen.getByRole("button", { name: "Меню" })).toMatchAriaSnapshot();
});
