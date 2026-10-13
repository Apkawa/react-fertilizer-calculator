import { type RenderResult, render } from "@testing-library/react";
import React, { type ReactElement } from "react";
import { MemoryRouter } from "react-router-dom";

// React 18: в @types/react-router не описан `children` у MemoryRouter
// (@types/react-router не резолвится из apps — augmentation не сработала),
// поэтому локальная обёртка с явным типом children.
const Router: React.ComponentType<{ initialEntries?: string[]; children?: React.ReactNode }> =
  MemoryRouter as React.ComponentType<{ initialEntries?: string[]; children?: React.ReactNode }>;

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
  return render(<Router initialEntries={initialEntries}>{ui}</Router>);
}
