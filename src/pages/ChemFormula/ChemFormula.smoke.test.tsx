import { waitFor } from "@testing-library/react";
import React from "react";
import { Route } from "react-router-dom";
import { renderApp } from "@/test-utils/render";
import ChemFormula from "./index";

// Смоук: страница Парсера формул на реальном URL парсится без исключений.
test("pages/ChemFormula smoke: таблица атомных масс рендерится", async () => {
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
}, 30000);
