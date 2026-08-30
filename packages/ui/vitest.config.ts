import { defineConfig } from "vitest/config";

// UI-атомы: jsdom; .css-импорты в тестах заглушает vitest (css: false по умолчанию).
export default defineConfig({
  test: {
    globals: true,
    environment: "jsdom",
    // Тесты в папке компонента — test.tsx (помимо *.test.tsx в корне src/)
    include: ["src/**/*.test.tsx", "src/**/test.tsx"],
    exclude: ["**/node_modules/**", "**/dist/**"],
  },
});
