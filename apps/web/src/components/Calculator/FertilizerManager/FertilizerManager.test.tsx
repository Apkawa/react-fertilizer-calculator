import { within } from "@testing-library/react";
import React from "react";
import { renderApp } from "@/test-utils/render";
import { List as FertilizerManager } from "./List";

// Смоук: менеджер удобрений (sortable-список + импорт/экспорт)
// рендерится без исключений.
test("components/Calculator/FertilizerManager smoke: менеджер удобрений рендерится", () => {
  const { container } = renderApp(<FertilizerManager />);
  expect(container.textContent).toContain("Импорт/Экспорт");
}, 15000);

// a11y (stage 2): icon-only кнопки менеджера имеют доступные имена
// (getByRole("button", { name }) должно работать — без хрупких DOM-локейторов).
test("components/Calculator/FertilizerManager: icon-only кнопки имеют доступные имена", () => {
  const { container } = renderApp(<FertilizerManager />);
  // Одинаковые для одного контроля в компоненте
  for (const name of ["Добавить", "Импорт удобрений", "Экспорт удобрений", "Сбросить список"]) {
    expect(within(container).getByRole("button", { name }), `кнопка «${name}»`).not.toBeNull();
  }
  // У каждого пункта списка свои «Изменить»/«Удалить»
  expect(within(container).getAllByRole("button", { name: "Изменить" }).length).toBeGreaterThan(0);
  expect(within(container).getAllByRole("button", { name: "Удалить" }).length).toBeGreaterThan(0);
}, 15000);
