import { waitFor } from "@testing-library/react";
import React from "react";
import { Route } from "react-router-dom";
import { renderApp } from "@/test-utils/render";
import ChemFormula from "./index";

// Смоук + канон Stage 7 (guideline §2.2/§5): страница внутри Card-обёртки
// (data-ui="card"), заголовок страницы — канонический h1, секции — h2/h3
// (без text-* override'ов); собственные width-контейнеры запрещены — рамка
// Root уже даёт max-w 936 px-4, поэтому в разметке нет inline-стилей
// (легасный width: 936 давал горизонтальный переполнение на 390px).
test("pages/ChemFormula smoke: канон Card + заголовок h1 + таблицы", async () => {
  const { container } = renderApp(
    <Route path="/formula/:formula?/:percent?" component={ChemFormula} />,
    ["/formula/NaCl/98"],
  );
  await waitFor(
    () => {
      expect(container.textContent).toContain("Атомная масса");
    },
    { timeout: 10000 },
  );
  expect(container.textContent).toContain("Парсер формул");
  expect(container.querySelector('[data-ui="card"]')).not.toBeNull();
  expect(container.querySelector("h1")?.textContent).toBe("Парсер формул");
  expect(container.querySelector("h2")?.textContent).toBe("Атомная масса");
  expect(container.querySelector("table")).not.toBeNull();
  expect(container.querySelector("[style]")).toBeNull();
}, 30000);
