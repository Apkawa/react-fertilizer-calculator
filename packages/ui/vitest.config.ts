import react from "@vitejs/plugin-react";
import { playwright } from "@vitest/browser-playwright";
import { defineConfig } from "vitest/config";

// UI-атомы: два проекта — node (jsdom-юнит-тесты, их крутит корневой pnpm test)
// и browser (регрессионные тесты в chromium, локально/руками: test:browser).
// Плагин React обязателен в browser mode (classic JSX, как в приложении).
export default defineConfig({
  plugins: [react({ jsxRuntime: "classic" })],
  test: {
    globals: true,
    projects: [
      {
        test: {
          name: "node",
          environment: "jsdom",
          // globals не наследуется из корневых опций в projects — повторяем
          globals: true,
          // Тесты в папке компонента — test.tsx (помимо *.test.tsx в корне src/);
          // браузерные browser.test.tsx исключены из jsdom-проекта
          include: ["src/**/*.test.tsx", "src/**/test.tsx"],
          exclude: ["**/node_modules/**", "**/dist/**", "**/browser.test.tsx"],
        },
      },
      {
        test: {
          name: "browser",
          browser: {
            enabled: true,
            headless: true,
            provider: playwright(),
            // Фиксированный viewport для воспроизводимых ARIA-снапшотов
            instances: [{ browser: "chromium", viewport: { width: 1280, height: 720 } }],
          },
          include: ["src/**/browser.test.tsx"],
          exclude: ["**/node_modules/**", "**/dist/**"],
        },
      },
    ],
  },
});
