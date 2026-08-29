import { type RenderResult, render } from "@testing-library/react";
import React, { type ReactElement } from "react";

/**
 * Общий хелпер для смок-тестов пакета: обычный render без темы.
 * (Старый ThemeProvider убран: цвета компонентами потребляются из
 * CSS-переменных темы @fertilizer/ui, которые подставляет приложение.)
 */
export function renderIcons(ui: ReactElement): RenderResult {
  return render(ui);
}
