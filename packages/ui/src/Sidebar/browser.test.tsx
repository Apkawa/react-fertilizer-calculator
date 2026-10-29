// Браузерный регрессионный тест Sidebar (vitest browser mode, chromium).
// Portal: SidebarContainer рендерится в #sidebar-root (вне container) —
// панель ищем page-локаторами (getByRole по заголовку/кнопкам).
// viewport 1280×720: docked — только извне (порог ширины в apps/web Root.tsx,
// внутри Sidebar порогов нет) — BaseSidebar без docked → drawer, есть «Закрыть».
import React from "react";
import { expect, test } from "vitest";
import { page } from "vitest/browser";
import { mountBrowser } from "../browser-test-utils";
// Тема (токены --card и пр.) для проверки фонов в browser-режиме: без неё
// token-фон резолвится в transparent и assertions бессмысленны.
import "../theme.css";
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

// Layout-контракт (доработка после Stage 8): оверлей fixed — панель не
// убегает при прокрутке страницы (docked: без лока body, скролл реальный);
// footer-слот прижат низу карточки и остаётся видимым при переполнении
// контента (так размещаются тумблер темы и выбор схемы в TabMenu);
// контент скроллится внутри карточки (sidebarContent). Геометрия — прямые
// rect: портал в том же document, page.locator в vitest browser недоступен.
test("Sidebar: fixed-панель и footer вниз при прокрутке страницы", async () => {
  function DockedSidebar() {
    return (
      <Sidebar docked title="Панель" footer={<div data-testid="foot">контролы внизу</div>}>
        {Array.from({ length: 40 }, (_, i) => (
          <div key={i} style={{ height: "40px" }}>
            пункт {i}
          </div>
        ))}
      </Sidebar>
    );
  }
  mountBrowser(<DockedSidebar />);
  document.body.style.height = "3000px"; // длинная страница — реальный скролл
  window.scrollTo(0, 500);
  await expect.element(page.getByText("контролы внизу")).toBeVisible();

  const card = document.querySelector('[data-ui="sidebar"]');
  const wrap = card?.querySelector('[class*="sidebarContent"]');
  const foot = document.querySelector('[data-testid="foot"]');
  expect(card).toBeTruthy();
  expect(wrap).toBeTruthy();
  expect(foot).toBeTruthy();
  if (card && wrap && foot) {
    // fixed: низкой прокрутки панель прижата к viewport (не уезжает вверх)
    expect(card.getBoundingClientRect().top).toBe(0);
    // footer прижат низу карточки (padding карточки 8px) при переполнении
    const cardRect = card.getBoundingClientRect();
    const footRect = foot.getBoundingClientRect();
    expect(Math.abs(cardRect.bottom - footRect.bottom - 8)).toBeLessThan(2);
    // контент скроллится внутри карточки
    expect((wrap as HTMLElement).scrollHeight).toBeGreaterThan((wrap as HTMLElement).clientHeight);
  }
  document.body.style.height = "";
});

// Косметика (round 12): иконка закрытия — IconButton 40×40 в правом верхнем
// углу карточки (padding 8px) и перекрывает меню: контент без title
// начинается вверху карточки (шапка-строка убрана).
test("Sidebar drawer: «Закрыть» — 40×40 в правом верхнем углу поверх меню", async () => {
  mountBrowser(
    <Sidebar>
      <div>меню</div>
    </Sidebar>,
  );
  const burger = page.getByRole("button", { name: "Меню" });
  await expect.element(burger).toBeVisible();
  await burger.click();

  const card = document.querySelector('[data-ui="sidebar"]') as HTMLElement;
  const close = card.querySelector('[class*="sidebarClose"]') as HTMLElement;
  const content = card.querySelector('[class*="sidebarContent"]') as HTMLElement;
  expect(card).toBeTruthy();
  expect(close).toBeTruthy();
  expect(content).toBeTruthy();

  const cardRect = card.getBoundingClientRect();
  const closeRect = close.getBoundingClientRect();
  const contentRect = content.getBoundingClientRect();
  expect(closeRect.width).toBe(40);
  expect(closeRect.height).toBe(40);
  // Круг (round 13): прилеплена к верхнему-правому краю карточки без отступа
  expect(Math.abs(cardRect.right - closeRect.right)).toBeLessThan(2);
  expect(Math.abs(closeRect.top - cardRect.top)).toBeLessThan(2);
  // меню сдвинуто наверх: контент начинается вверху карточки и перекрывается
  // иконкой; прилепление к краю (round 13) — иконка выходит за content box
  // (padding 8px), но её левый край внутри контента (пересечение есть)
  expect(Math.abs(contentRect.top - cardRect.top - 8)).toBeLessThan(2);
  expect(closeRect.left).toBeGreaterThan(contentRect.left);
  expect(closeRect.left).toBeLessThan(contentRect.right);
  // round 14: фон кнопки непрозрачный (--card, без альфа-канала tint'а) и
  // совпадает с фоном карточки — текст меню под кнопкой не просвечивает
  const closeBg = getComputedStyle(close).backgroundColor;
  expect(closeBg, "solid — без альфа-канала").not.toMatch(/^rgba\(/);
  expect(closeBg).toBe(getComputedStyle(card).backgroundColor);
});

// Косметика (round 15): появление/убирание drawer — быстрая анимация (slide
// карточки + fade оверлея): карточка анимируется при открытии, при закрытии
// доигрывает slide-out и размонтируется после неё. CSS-modules хешит имена
// keyframes — проверяем по подстроке имени.
test("Sidebar drawer: появление и убирание анимированы", async () => {
  mountBrowser(
    <Sidebar>
      <div>меню</div>
    </Sidebar>,
  );
  const burger = page.getByRole("button", { name: "Меню" });
  await expect.element(burger).toBeVisible();
  await burger.click();

  const card = document.querySelector('[data-ui="sidebar"]') as HTMLElement;
  expect(card).toBeTruthy();
  expect(getComputedStyle(card).animationName).toMatch(/CardIn/);

  // locator-click (await): React flush-ит batched-обновление на await-границе
  await page.getByRole("button", { name: "Закрыть" }).click();
  expect(getComputedStyle(card).animationName).toMatch(/CardOut/);
  expect(document.querySelector('[data-ui="sidebar"]'), "до анимации панель живёт").toBeTruthy();
  // slide-out 0.14s + страховка: после анимации (или таймера) панель мёртвая
  await new Promise((r) => setTimeout(r, 700));
  expect(document.querySelector('[data-ui="sidebar"]')).toBeNull();
});
