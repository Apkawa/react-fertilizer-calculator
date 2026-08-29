import { vanillaExtractPlugin } from "@vanilla-extract/vite-plugin";
import { defineConfig } from "vitest/config";

// Иконки — React UI: тесты в jsdom-окружении с глобалами (test/expect), как и в приложении.
// vanilla-extract: IconButton использует Button из @fertilizer/ui (компиляция .css.ts, как и в приложении).
export default defineConfig({
  plugins: [vanillaExtractPlugin()],
  test: {
    globals: true,
    environment: "jsdom",
    exclude: ["**/node_modules/**", "**/dist/**"],
  },
});
