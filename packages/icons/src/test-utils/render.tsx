import { type RenderResult, render } from "@testing-library/react";
import { polaris } from "@theme-ui/presets";
import React, { type ReactElement } from "react";
import { ThemeProvider } from "theme-ui";

/**
 * Общий хелпер для смок-тестов пакета: та же обвязка, что и в приложении
 * (ThemeProvider theme-ui) — тема polaris, у которой есть colors.text /
 * colors.background, читаемые Icon/IconButton.
 */
export function renderIcons(ui: ReactElement): RenderResult {
  return render(<ThemeProvider theme={polaris}>{ui}</ThemeProvider>);
}
