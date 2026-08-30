import { render, screen } from "@testing-library/react";
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

// a11y (stage 2): триггер открытия (бургер) — настоящая <button> с именем.
// В jsdom окно 1024px → сайдбар не докнут, бургер виден.
test("Sidebar: бургер открытия — <button> с доступным именем «Меню»", () => {
  render(
    <Sidebar title="Тестовый сайдбар">
      <div>содержимое сайдбара</div>
    </Sidebar>,
  );
  const button = screen.getByRole("button", { name: "Меню" });
  expect(button.tagName).toBe("BUTTON");
  expect(button.getAttribute("aria-label")).toBe("Меню");
});

// a11y (stage 2): контрол закрытия (не докнутый сайдбар) — <button> с именем.
test("Sidebar: контрол закрытия — <button> с доступным именем «Закрыть»", () => {
  render(
    <Sidebar opened title="Тестовый сайдбар">
      <div>содержимое сайдбара</div>
    </Sidebar>,
  );
  const button = screen.getByRole("button", { name: "Закрыть" });
  expect(button.tagName).toBe("BUTTON");
  expect(button.getAttribute("aria-label")).toBe("Закрыть");
});
