import React from "react";
import { renderApp } from "@/test-utils/render";
import { Sidebar } from "./Sidebar";

// Смоук: открытый сайдбар рендерится. SidebarContainer — портал
// (#sidebar-root), поэтому ищем в document.body.
test("components/ui/Sidebar smoke: открытый сайдбар рендерит контент", () => {
  renderApp(
    <Sidebar opened title="Тестовый сайдбар">
      <div>содержимое сайдбара</div>
    </Sidebar>,
  );
  expect(document.body.textContent).toContain("Тестовый сайдбар");
  expect(document.body.textContent).toContain("содержимое сайдбара");
}, 15000);
