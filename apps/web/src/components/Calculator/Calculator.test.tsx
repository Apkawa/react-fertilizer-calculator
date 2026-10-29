import { within } from "@testing-library/react";
import React from "react";
import { renderApp } from "@/test-utils/render";
import { resetStore } from "@/test-utils/state";
import Calculator from "./index";

beforeEach(resetStore);

// Смоук: вся форма Калькулятора (zustand-форма + store + модалки)
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
  // Кнопки «Удобрений» (plus/импорт/экспорт/сброс) — merged-карточка в левой
  // колонке (§3.1), покрыта ниже и в FertilizerManager.test.tsx.
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

// Merged-карточка «Удобрения» (канон §3.1): менеджер над библиотекой
// (calculator.fertilizers) заменяет дропдаун-селектор «Добавить удобрение».
// Шапка: заголовок + plus + eye-toggle (§3.1 + т. заказчика). Импорт/экспорт/
// сброс библиотеки переехали в карточку «Импорт/Экспорт» — строкой под
// «Рецепты» (т. заказчика).
test("components/Calculator: merged-карточка «Удобрения» в левой колонке", () => {
  const { container } = renderApp(<Calculator />);
  expect(within(container).getByRole("heading", { name: "Удобрения" })).not.toBeNull();

  const plus = within(container).getByRole("button", { name: "Добавить удобрение" });
  const eye = within(container).getByRole("button", { name: "Скрыть неактивные удобрения" });
  // Порядок шапки (§3.1 + т. заказчика): plus сразу за заголовком, затем eye
  expect(plus.compareDocumentPosition(eye) & Node.DOCUMENT_POSITION_FOLLOWING).not.toBe(0);

  // Строка «Удобрения» — под строкой «Рецепты» карточки «Импорт/Экспорт».
  const recipesReset = within(container).getByRole("button", { name: "Сбросить рецепты" });
  const fertButtons = ["Импорт удобрений", "Экспорт удобрений", "Сбросить удобрения"].map((name) =>
    within(container).getByRole("button", { name }),
  );
  for (const btn of fertButtons) {
    expect(
      recipesReset.compareDocumentPosition(btn) & Node.DOCUMENT_POSITION_FOLLOWING,
      `«${btn.getAttribute("aria-label")}» после «Сбросить рецепты»`,
    ).not.toBe(0);
  }

  // Чекбокс ряда библиотеки: доступное имя «Выбрать "<id>"» (id — как в ряду)
  expect(
    within(container).getByRole("checkbox", {
      name: /^Выбрать .*Нитрат аммония \(NH4NO3\)$/,
    }),
  ).not.toBeNull();

  // Селектор удалён (§3.1): нет combobox «Добавить удобрение», нет chevron
  // «Открыть список», нет обёртки dropdown.
  expect(within(container).queryByRole("combobox", { name: "Добавить удобрение" })).toBeNull();
  expect(within(container).queryByRole("button", { name: "Открыть список" })).toBeNull();
  expect(container.querySelector('[data-ui="dropdown"]')).toBeNull();
}, 15000);
