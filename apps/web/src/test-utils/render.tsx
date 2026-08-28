import { type RenderResult, render } from "@testing-library/react";
import React, { type ReactElement } from "react";
import { MemoryRouter } from "react-router-dom";
import { ThemeProvider } from "theme-ui";
import { defaultTheme } from "@/themes";

/**
 * Общий хелпер для смок-тестов компонентов: тема + роутер —
 * та же обвязка, что и в реальном приложении (Root.tsx).
 *
 * Состояние — глобальный zustand-стор (`@/store`): доступ и из теста,
 * и из компонентов без Provider. Херметичность — через `resetStore()`
 * (test-utils/state).
 */
export function renderApp(ui: ReactElement, initialEntries: string[] = ["/"]): RenderResult {
  return render(
    <ThemeProvider theme={defaultTheme}>
      <MemoryRouter initialEntries={initialEntries}>{ui}</MemoryRouter>
    </ThemeProvider>,
  );
}
