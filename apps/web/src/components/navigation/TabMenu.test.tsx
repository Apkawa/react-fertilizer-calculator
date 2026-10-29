import { fireEvent, within } from "@testing-library/react";
import React from "react";
import { renderApp } from "@/test-utils/render";
import { TabMenu } from "./TabMenu";

// Контролы темы/схемы — пропсы из Root (доработка после Stage 8: переехали
// из header вниз сайдбара). В смоке — фиктивные значения/колбэки.
const controlsProps = {
  colorMode: "light" as const,
  onColorModeChange: () => {},
  schemeId: "default" as const,
  onSchemeChange: () => {},
};

// Смоук: меню рендерится. В jsdom окно 1024px (< порога канона 1250px) →
// сайдбар не докнут, видим только кнопку-бургер (ссылки и контролы темы/схемы
// скрыты внутри закрытого оверлея).
test("TabMenu smoke: меню рендерит кнопку-бургер", () => {
  const { container } = renderApp(<TabMenu {...controlsProps} />);
  expect(container.querySelector("svg")).not.toBeNull();
});

// Канон §2.2–2.3: при узком окне сайдбар — drawer: бургер «Меню» виден;
// закрытая панель не содержит контролов темы/схемы.
test("TabMenu smoke: узкое окно (docked=false) — бургер «Меню» виден", () => {
  const { container } = renderApp(
    <TabMenu docked={false} opened={false} onClose={() => {}} {...controlsProps} />,
  );
  expect(within(container).getByRole("button", { name: "Меню" })).not.toBeNull();
  expect(document.querySelector('[aria-label="Переключить тему"]')).toBeNull();
});

// ≥1250px: сайдбар докнут (fixed-панель) — триггер-бургер не нужен;
// панель открыта и содержит контролы внизу (тумблер темы + выбор схемы).
test("TabMenu smoke: docked — бургера нет, контролы темы/схемы в панели", () => {
  const { container } = renderApp(<TabMenu docked opened {...controlsProps} />);
  expect(within(container).queryByRole("button", { name: "Меню" })).toBeNull();
  const panel = document.querySelector('[data-ui="sidebar"]');
  expect(panel?.querySelector('[aria-label="Переключить тему"]')).not.toBeNull();
  expect(panel?.querySelector('[aria-label="Цветовая схема"]')).not.toBeNull();
});

// a11y (stage 2): бургер — настоящая кнопка с доступным именем
// (ранее кликабельный div-Icon — хрупкий локейтор div:has(> svg) в e2e).
test("TabMenu: бургер — кнопка с доступным именем «Меню»", () => {
  const { container } = renderApp(<TabMenu {...controlsProps} />);
  expect(within(container).getByRole("button", { name: "Меню" })).not.toBeNull();
}, 15000);

// Косметика (round 10): оверлей больше не схлопывает drawer всплытием клика
// из панели, поэтому закрытие на навигации несёт сама навигация (клик по
// вкладке), а контролы footer (select схемы) drawer не закрывают. Красный.
test("TabMenu drawer: клик по вкладке закрывает панель, клик по select схемы — нет", () => {
  let closed = 0;
  renderApp(<TabMenu docked={false} opened onClose={() => closed++} {...controlsProps} />);
  const panel = document.querySelector('[data-ui="sidebar"]') as HTMLElement;
  fireEvent.click(within(panel).getByText("Калькулятор"));
  expect(closed, "навигация закрывает drawer").toBe(1);
  fireEvent.click(panel.querySelector('[aria-label="Цветовая схема"]')!);
  expect(closed, "выбор схемы не закрывает drawer").toBe(1);
});
