import { waitFor, within } from "@testing-library/react";
import React from "react";
import { renderApp } from "@/test-utils/render";
import CalculatorPage from "./index";

// Смоук: страница Калькулятора (лениво загружаемый компонент; отдельный
// экран «Удобрения» удалён — один маршрут) монтируется в jsdom без
// исключений.
test("pages/Calculator smoke: страница монтируется и показывает результат", async () => {
  const { container } = renderApp(<CalculatorPage />);
  await waitFor(
    () => {
      expect(container.textContent).toContain("Результат расчета");
      // Merged-карточка «Удобрения» (канон §3.1) — на странице калькулятора.
      expect(within(container).getByRole("heading", { name: "Удобрения" })).not.toBeNull();
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
