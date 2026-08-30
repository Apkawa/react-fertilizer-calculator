import { within } from "@testing-library/react";
import React from "react";
import { renderApp } from "@/test-utils/render";
import Calculator from "./index";

// Смоук: вся форма Калькулятора (redux-form + store + модалки)
// рендерится без исключений.
test("components/Calculator smoke: форма калькулятора рендерится", () => {
  const { container } = renderApp(<Calculator />);
  expect(container.textContent).toContain("Результат расчета");
}, 15000);

// a11y (stage 2): у каждой icon-only кнопки формы есть доступное имя.
// Имена стабильные, русские, уникальны для контроля в своей области:
// «Сохранить комплекс»/«Отправить на миксер» — кнопки с текстом (не icon-only).
test("components/Calculator: все icon-only кнопки имеют доступные имена", () => {
  const { container } = renderApp(<Calculator />);
  // Кнопки FertilizerManager (plus/импорт/экспорт/сброс списка) — отдельный
  // маршрут /fertilizers, покрыт FertilizerManager.test.tsx.
  const names = [
    // Импорт/Экспорт (рецепты и настройки)
    "Импорт рецептов",
    "Экспорт рецептов",
    "Сбросить рецепты",
    "Импорт настроек",
    "Экспорт настроек",
    // Рецепт (сохранить/сбросить/настроить профиль)
    "Сохранить рецепт",
    "Сбросить рецепт",
    "Настройки рецепта",
    // Кнопки с видимым текстом (контроль иконки + подписи)
    "Отправить на миксер",
  ];
  for (const name of names) {
    expect(within(container).getByRole("button", { name }), `кнопка «${name}»`).not.toBeNull();
  }
}, 15000);
