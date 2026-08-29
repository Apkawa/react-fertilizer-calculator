import { render } from "@testing-library/react";
import React from "react";
import { Sidebar } from "./sidebar";

// Открытый сайдбар рендерится. SidebarContainer — портал (#sidebar-root),
// поэтому ищем в document.body.
test("Sidebar smoke: открытый сайдбар рендерит контент", () => {
  render(
    <Sidebar opened title="Тестовый сайдбар">
      <div>содержимое сайдбара</div>
    </Sidebar>,
  );
  expect(document.body.textContent).toContain("Тестовый сайдбар");
  expect(document.body.textContent).toContain("содержимое сайдбара");
});
