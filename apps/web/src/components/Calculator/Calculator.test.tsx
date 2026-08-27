import React from "react";
import { renderApp } from "@/test-utils/render";
import Calculator from "./index";

// Смоук: вся форма Калькулятора (redux-form + store + модалки)
// рендерится без исключений.
test("components/Calculator smoke: форма калькулятора рендерится", () => {
  const { container } = renderApp(<Calculator />);
  expect(container.textContent).toContain("Результат расчета");
}, 15000);
