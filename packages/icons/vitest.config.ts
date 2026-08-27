import { defineConfig } from "vitest/config";

// Иконки — React UI: тесты в jsdom-окружении с глобалами (test/expect), как и в приложении.
export default defineConfig({
  test: {
    globals: true,
    environment: "jsdom",
    exclude: ["**/node_modules/**", "**/dist/**"],
  },
});
