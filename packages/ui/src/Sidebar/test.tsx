import { act, fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { Sidebar } from "./index";

// Открытый сайдбар рендерится. SidebarContainer — портал (#sidebar-root),
// поэтому ищем в document.body.
test("Sidebar smoke: открытый сайдбар рендерит контент", () => {
  render(
    <Sidebar opened title="Тестовый сайдбар">
      <div>содержимое сайдбара</div>
    </Sidebar>,
  );
  expect(document.body.textContent).toContain("Тестовый сайдбар");
  expect(document.body.textContent).toContain("содержимое сайдбара");
});

// a11y (stage 2): триггер открытия (бургер) — настоящая <button> с именем.
// В jsdom окно 1024px → сайдбар не докнут, бургер виден.
test("Sidebar: бургер открытия — <button> с доступным именем «Меню»", () => {
  render(
    <Sidebar title="Тестовый сайдбар">
      <div>содержимое сайдбара</div>
    </Sidebar>,
  );
  const button = screen.getByRole("button", { name: "Меню" });
  expect(button.tagName).toBe("BUTTON");
  expect(button.getAttribute("aria-label")).toBe("Меню");
});

// a11y (stage 2): контрол закрытия (не докнутый сайдбар) — <button> с именем.
test("Sidebar: контрол закрытия — <button> с доступным именем «Закрыть»", () => {
  render(
    <Sidebar opened title="Тестовый сайдбар">
      <div>содержимое сайдбара</div>
    </Sidebar>,
  );
  const button = screen.getByRole("button", { name: "Закрыть" });
  expect(button.tagName).toBe("BUTTON");
  expect(button.getAttribute("aria-label")).toBe("Закрыть");
});

// Stage 2 «restyle» (red-фаза): хук data-ui на карточке-панели внутри оверлея
// (не на оверлее — оверлей декоративный фон через токены, схемы мишатся на
// drawer: ширина/рамка панели). Панель опознаём по родителю-оверлею
// (tabIndex=-1 — существующий контракт markup). Красный.
test('Sidebar: панель несёт хук data-ui="sidebar"', () => {
  render(
    <Sidebar opened title="Тестовый сайдбар">
      <div>содержимое сайдбара</div>
    </Sidebar>,
  );
  const panel = document.body.querySelector('[data-ui="sidebar"]') as HTMLElement | null;
  expect(panel).not.toBeNull();
  expect(panel?.parentElement?.getAttribute("tabindex")).toBe("-1");
});

// Footer-слот панели: прижат вниз карточки вне скролл-области контента
// (в footer кладём тумблер темы и выбор схемы — всегда видны).
test("Sidebar: footer-слот — последний ребёнок карточки, после контента", () => {
  render(
    <Sidebar opened title="Тестовый сайдбар" footer={<div data-testid="foot">контролы</div>}>
      <div>содержимое сайдбара</div>
    </Sidebar>,
  );
  const panel = document.body.querySelector('[data-ui="sidebar"]') as HTMLElement | null;
  expect(panel).not.toBeNull();
  expect(panel?.querySelector('[data-testid="foot"]')).not.toBeNull();
  // footer-слот — в обёртке sidebarFooter: последний ребёнок карточки, после контента
  expect(panel?.lastElementChild?.querySelector('[data-testid="foot"]')).not.toBeNull();
});

// Косметика (round 10): drawer закрывается кликом по ПОВЕРХНОСТИ оверлея, а не
// всплытием клика из панели — открытие native select в footer (выбор схемы)
// не должен схлопывать drawer. Красный: оверлей.close на любой клик внутри.
test("Sidebar: клик внутри панели не закрывает drawer, клик по оверлею — закрывает", () => {
  let closed = 0;
  render(
    <Sidebar
      opened
      title="Тестовый сайдбар"
      onClose={() => closed++}
      footer={
        <button type="button" data-testid="foot-btn">
          схема
        </button>
      }
    >
      <div>содержимое сайдбара</div>
    </Sidebar>,
  );
  const overlay = document.body.querySelector('[data-ui="sidebar"]')!.parentElement as HTMLElement;
  fireEvent.click(overlay.querySelector('[data-testid="foot-btn"]')!);
  expect(closed, "клик по контролу footer не закрывает drawer").toBe(0);
  fireEvent.click(overlay);
  expect(closed, "клик по оверлею закрывает drawer").toBe(1);
});

// Косметика (round 12): закрытие — IconButton (квадрат 2.5rem дефолтом, тот
// же глиф «close», что в Modal) и первый ребёнок карточки: в углу поверх
// меню, без шапки-строки. Красный: легасный <button> + header-ряд.
test("Sidebar: закрытие — IconButton «Закрыть», квадратный, первым ребёнком карточки", () => {
  render(
    <Sidebar opened title="Тестовый сайдбар">
      <div>содержимое сайдбара</div>
    </Sidebar>,
  );
  const close = screen.getByRole("button", { name: "Закрыть" });
  expect(close.style.width, "icon-only дефолт IconButton").toBe("2.5rem");
  expect(close.className).toContain("sidebarClose");
  const panel = document.querySelector('[data-ui="sidebar"]') as HTMLElement;
  expect(panel.firstElementChild?.className).toContain("sidebarClose");
});

// Косметика (round 14): закрытие не просвечивает меню — solid (непрозрачный
// bg-[var(--card)]). Красный: Sidebar не передаёт solid.
test("Sidebar: закрытие — непрозрачный фон (--card), без просвечивания меню", () => {
  render(
    <Sidebar opened title="Тестовый сайдбар">
      <div>содержимое сайдбара</div>
    </Sidebar>,
  );
  const close = screen.getByRole("button", { name: "Закрыть" });
  expect(close.style.backgroundColor, "solid — inline фон --card").toBe("var(--card)");
});

// Меню без title: пустой <h2> не рендерится — контент начинается вверху
// карточки (иконка закрытия перекрывает его в правом верхнем углу).
test("Sidebar: без title — нет <h2>, контент карточки после иконки закрытия", () => {
  render(
    <Sidebar opened>
      <div>содержимое сайдбара</div>
    </Sidebar>,
  );
  const panel = document.querySelector('[data-ui="sidebar"]') as HTMLElement;
  expect(panel.querySelector("h2")).toBeNull();
  expect(panel.children[1]?.className).toContain("sidebarContent");
});

// Косметика (round 15): drawer появляется со slide-in, убирается со slide-out —
// панель доигрывает анимацию ухода и размонтируется страховка-таймером
// (animationend в jsdom из portal-домa до React не доходит — реальный
// animationend покрыт browser-тестом). Красный: анимационных классов нет,
// размонтирование мгновенное.
test("Sidebar: drawer — slide-in при появлении, slide-out при уходе, таймер размонтирует", () => {
  vi.useFakeTimers();
  render(
    <Sidebar opened title="Тестовый сайдбар">
      <div>содержимое сайдбара</div>
    </Sidebar>,
  );
  const panel = document.querySelector('[data-ui="sidebar"]') as HTMLElement;
  expect(panel.className).toContain("sidebarCardIn");
  fireEvent.click(screen.getByRole("button", { name: "Закрыть" }));
  const closing = document.querySelector('[data-ui="sidebar"]') as HTMLElement;
  expect(closing, "панель живёт во время анимации ухода").toBeTruthy();
  expect(closing.className).toContain("sidebarCardOut");
  act(() => {
    vi.advanceTimersByTime(600);
  });
  expect(document.querySelector('[data-ui="sidebar"]')).toBeNull();
  vi.useRealTimers();
});
