import { render, waitFor } from "@testing-library/react";
import React from "react";
import { vi } from "vitest";
import Root from "../Root";

// Смоук-тест: настоящий корень приложения (zustand + HashRouter + тема CSS-переменными)
// рендерится в jsdom, лениво загруженный Калькулятор успевает смонтироваться,
// константы сборки (__VERSION__ и др.) подставляются в футер.
test("app smoke: root renders and calculator mounts", async () => {
  const { container } = render(<Root />);
  await waitFor(
    () => {
      // корневая обвязка: бургер сайдбара (при узком jsdom-окне drawer закрыт)
      expect(container.querySelector('[aria-label="Меню"]')).toBeTruthy();
      // ленивая страница Калькулятора смонтировалась (баланс + результат)
      expect(container.textContent).toContain("ΔΣ I");
      expect(container.textContent).toContain("Результат расчета");
    },
    { timeout: 10000 },
  );
}, 30000);

// Тема и схема сохраняются в localStorage и применяются к <html> в Root при
// монтировании (не зависит от сайдбара — при узком окне он закрыт бургером).
describe("app smoke: theme and scheme applied on root mount", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute("data-theme");
    document.documentElement.removeAttribute("data-scheme");
    // В этом jsdom window.matchMedia отсутствует вовсе — глобальный мок снимаем.
    vi.unstubAllGlobals();
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
    expect(document.documentElement.getAttribute("data-theme")).toBe("light");
  });

  // Намерение "system" резолвится через prefers-color-scheme (redesign §5):
  // в этом jsdom window.matchMedia отсутствует — подставляем глобальный мок.
  test("saved system mode resolves via prefers-color-scheme: dark", () => {
    vi.stubGlobal(
      "matchMedia",
      (query: string) =>
        ({
          media: query,
          matches: query === "(prefers-color-scheme: dark)",
          addEventListener: () => {},
          removeEventListener: () => {},
        }) as unknown as MediaQueryList,
    );
    localStorage.setItem("ui:color-mode", "system");
    render(<Root />);
    expect(document.documentElement.dataset.theme).toBe("dark");
  });

  // Схема оформления — ортогональна теме: отдельный ключ и html[data-scheme].
  test("saved scheme applies data-scheme on load", () => {
    localStorage.setItem("ui:color-scheme", "win95");
    render(<Root />);
    expect(document.documentElement.dataset.scheme).toBe("win95");
  });

  test("no saved scheme → default", () => {
    render(<Root />);
    expect(document.documentElement.dataset.scheme).toBe("default");
  });
});
