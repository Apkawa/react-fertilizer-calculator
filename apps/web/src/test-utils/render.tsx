import { type RenderResult, render } from "@testing-library/react";
import React, { type ReactElement } from "react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { ThemeProvider } from "theme-ui";
import { store } from "@/redux";
import { defaultTheme } from "@/themes";

/**
 * Общий хелпер для смок-тестов компонентов: store + тема + роутер —
 * та же обвязка, что и в реальном приложении (Root.tsx).
 *
 * `store` — синглтон модуля (src/redux): состояние и localStorage общие
 * для тестов в рамках одного файла, но свежие для каждого тестового файла
 * (vitest пересоздаёт jsdom-окружение и модули на файл).
 */
export function renderApp(ui: ReactElement, initialEntries: string[] = ["/"]): RenderResult {
  return render(
    <Provider store={store}>
      <ThemeProvider theme={defaultTheme}>
        <MemoryRouter initialEntries={initialEntries}>{ui}</MemoryRouter>
      </ThemeProvider>
    </Provider>,
  );
}
