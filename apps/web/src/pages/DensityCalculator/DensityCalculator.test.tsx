import React from "react";
import { Route } from "react-router-dom";
import { renderApp } from "@/test-utils/render";
import DensityCalculator from "./index";

// Смоук + канон Stage 7 (guideline §2.2/§3.4/§5): страница внутри Card-обёртки,
// заголовок — канонический h1; строки полей — label-ряды (подпись + контрол,
// единицы в подписи: «Концентрация, г/л», «Плотность, г/мл»); собственные
// width-контейнеры запрещены (рамка Root), inline-стилей в разметке нет.
test("pages/DensityCalculator smoke: канон Card + label-ряды", () => {
  const { container } = renderApp(
    <Route path="/density/:formula?/:concentration?/:density?" component={DensityCalculator} />,
    ["/density/NaCl/"],
  );
  expect(container.textContent).toContain("Калькулятор плотности");
  expect(container.querySelector('[data-ui="card"]')).not.toBeNull();
  expect(container.querySelector("h1")?.textContent).toBe("Калькулятор плотности");
  expect(container.querySelector('[data-ui="dropdown"]')).not.toBeNull();
  // a11y: combobox-триггер имеет доступное имя от label-пропа.
  expect(container.querySelector('[role="combobox"]')?.getAttribute("aria-label")).toBe("Соль");
  expect(container.querySelectorAll('[data-ui="label"]').length).toBe(3);
  expect(container.textContent).toContain("Соль");
  expect(container.textContent).toContain("Концентрация, г/л");
  expect(container.textContent).toContain("Плотность, г/мл");
  expect(container.querySelector("[style]")).toBeNull();
}, 15000);
