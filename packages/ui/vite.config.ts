import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// Vite-конфиг пакета подхватывается builder'ом @storybook/react-vite (Storybook).
// Vitest использует vitest.config.ts — этот файл тесты не затрагивает.
// classic JSX runtime — как в приложении (tsconfig jsx: "react").
export default defineConfig({
  plugins: [react({ jsxRuntime: "classic" })],
});
