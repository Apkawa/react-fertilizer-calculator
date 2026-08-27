import React from "react";
import { renderApp } from "@/test-utils/render";
import { List as FertilizerManager } from "./List";

// Смоук: менеджер удобрений (sortable-список + импорт/экспорт)
// рендерится без исключений.
test("components/Calculator/FertilizerManager smoke: менеджер удобрений рендерится", () => {
  const { container } = renderApp(<FertilizerManager />);
  expect(container.textContent).toContain("Импорт/Экспорт");
}, 15000);
