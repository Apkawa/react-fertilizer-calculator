import { defineConfig } from "vitest/config";

// Расчётное ядро — чистая логика, тесты в node-окружении с глобалами (describe/test/expect).
export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    exclude: ["**/node_modules/**", "**/dist/**"],
  },
});
