import { waitFor, within } from "@testing-library/react";
import React from "react";
import { renderApp } from "@/test-utils/render";
import CalculatorPage from "./index";

// Смоук: страница Калькулятора (свой вложенный HashRouter + лениво
// загружаемые компоненты) монтируется в jsdom без исключений.
test("pages/Calculator smoke: страница монтируется и показывает результат", async () => {
  const { container } = renderApp(<CalculatorPage />);
  await waitFor(
    () => {
      expect(container.textContent).toContain("Результат расчета");
    },
    { timeout: 10000 },
  );
  // a11y (stage 2): иконные кнопки страницы адресуются по доступному имени —
  // icon-only «Импорт настроек» (блок Импорт/Экспорт).
  await waitFor(
    () => {
      expect(within(container).getByRole("button", { name: "Импорт настроек" })).not.toBeNull();
    },
    { timeout: 10000 },
  );
}, 30000);
