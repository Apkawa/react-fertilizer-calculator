import { waitFor } from "@testing-library/react";
import React from "react";
import { Route } from "react-router-dom";
import { renderApp } from "@/test-utils/render";
import { Help } from "./Help";

// Смоук: страница Справки рендерит конкретную .md-страницу
// (ленивый import ?raw → ReactMarkdown).
test("pages/Help smoke: справка рендерит markdown", async () => {
  const { container } = renderApp(<Route path="/help/:slug*" component={Help} />, [
    "/help/how_to_use",
  ]);
  await waitFor(
    () => {
      expect(container.textContent).toContain("Расчет растворов для гидропоники");
    },
    { timeout: 10000 },
  );
  // Канон Stage 7 (§2.2): Справка живёт в общей рамке Root (max-w 936 px-4);
  // легасный inline max-width: 960 — собственный контейнер ширины, запрещён.
  expect(container.querySelector("[style]")).toBeNull();
}, 30000);
