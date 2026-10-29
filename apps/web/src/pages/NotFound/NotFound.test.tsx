import React from "react";
import { renderApp } from "@/test-utils/render";
import NotFound from "./index";

// Смоук + канон Stage 7: 404 — Card-обёртка (data-ui="card") и канонический
// заголовок h1 (иерархия Text/Heading, без UA-размера); юзер-текст — RU.
test("pages/NotFound smoke: канон Card + заголовок h1", () => {
  const { container } = renderApp(<NotFound />);
  expect(container.textContent).toContain("Страница не найдена");
  expect(container.querySelector('[data-ui="card"]')).not.toBeNull();
  expect(container.querySelector("h1")?.textContent).toBe("Страница не найдена");
});
