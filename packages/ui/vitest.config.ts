import { vanillaExtractPlugin } from "@vanilla-extract/vite-plugin";
import { defineConfig } from "vitest/config";

// UI-атомы: jsdom + vanilla-extract (.css.ts компилируется в тестах, как и в приложении).
export default defineConfig({
  plugins: [vanillaExtractPlugin()],
  test: {
    globals: true,
    environment: "jsdom",
    exclude: ["**/node_modules/**", "**/dist/**"],
  },
});
