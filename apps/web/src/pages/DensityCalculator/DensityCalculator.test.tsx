import React from "react";
import { Route } from "react-router-dom";
import { renderApp } from "@/test-utils/render";
import DensityCalculator from "./index";

// Смоук: страница Калькулятора плотности на реальном URL.
test("pages/DensityCalculator smoke: калькулятор плотности рендерится", () => {
  const { container } = renderApp(
    <Route path="/density/:formula?/:concentration?/:density?" component={DensityCalculator} />,
    ["/density/NaCl/"],
  );
  expect(container.textContent).toContain("Калькулятор плотности");
}, 15000);
