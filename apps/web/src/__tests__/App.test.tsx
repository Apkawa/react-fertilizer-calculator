import { render, waitFor } from "@testing-library/react";
import React from "react";
import Root from "../Root";

// Смоук-тест: настоящий корень приложения (zustand + HashRouter + theme-ui)
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
