import { render, waitFor } from "@testing-library/react";
import React from "react";
import Root from "../Root";

// Смоук-тест: настоящий корень приложения (zustand + HashRouter + тема CSS-переменными)
// рендерится в jsdom, лениво загруженный Калькулятор успевает смонтироваться,
// константы сборки (__VERSION__ и др.) подставляются в футер.
test("app smoke: root renders and calculator mounts", async () => {
  const { container } = render(<Root />);
  await waitFor(
    () => {
      // корневая обвязка
      expect(container.textContent).toContain("Fork me on GitHub");
      // ленивая страница Калькулятора смонтировалась (баланс + результат)
      expect(container.textContent).toContain("ΔΣ I");
      expect(container.textContent).toContain("Результат расчета");
    },
    { timeout: 10000 },
  );
}, 30000);

// Тема сохраняется в localStorage и применяется к <html> в Root при монтировании
// (не зависит от сайдбара — при узком окне он закрыт бургером).
describe("app smoke: color mode applied on root mount", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute("data-theme");
  });

  test("legacy key migrates and applies dark mode on load", () => {
    localStorage.setItem("theme-ui:mode", "dark");
    render(<Root />);
    // <html> получает data-theme сразу при монтировании Root
    expect(document.documentElement.getAttribute("data-theme")).toBe("dark");
    // legacy-ключ мигрирован в новый
    expect(localStorage.getItem("ui:color-mode")).toBe("dark");
  });

  test("saved dark mode applies on load", () => {
    localStorage.setItem("ui:color-mode", "dark");
    render(<Root />);
    expect(document.documentElement.getAttribute("data-theme")).toBe("dark");
  });

  test("no saved mode → light (default)", () => {
    render(<Root />);
    expect(document.documentElement.getAttribute("data-theme")).toBe("default");
  });
});
