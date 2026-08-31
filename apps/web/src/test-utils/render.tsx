import { type RenderResult, render } from "@testing-library/react";
import React, { type ReactElement } from "react";
import { MemoryRouter } from "react-router-dom";

/**
 * Общий хелпер для смок-тестов компонентов: роутер —
 * та же обвязка, что и в реальном приложении (Root.tsx).
 * Тема — CSS-переменные @fertilizer/ui (в jsdom не применяются, на тесты не влияет).
 *
 * Состояние — глобальный zustand-стор (`@/store`): доступ и из теста,
 * и из компонентов без Provider. Херметичность — через `resetStore()`
 * (test-utils/state).
 */
export function renderApp(ui: ReactElement, initialEntries: string[] = ["/"]): RenderResult {
  return render(<MemoryRouter initialEntries={initialEntries}>{ui}</MemoryRouter>);
}
