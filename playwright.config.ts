import { defineConfig, devices } from "@playwright/test";

// Конфиг Playwright для e2e (tests/e2e/) и smoke (tests/smoke/) тестов.
// Целевой сервер — dev-сервер Vite (`pnpm start`, :3000), поднимается автоматически.
// Запуск: `pnpm test:e2e`, `pnpm test:smoke`.
export default defineConfig({
  testDir: "./tests",
  // Один воркер: браузерные тесты дешёвые, а изоляция важнее скорости.
  workers: 1,
  fullyParallel: false,
  retries: 1,
  reporter: [["list"]],
  timeout: 30_000,
  expect: { timeout: 10_000 },
  use: {
    baseURL: "http://localhost:3000",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    command: "pnpm start",
    url: "http://localhost:3000",
    // Если dev-сервер уже запущен (например, разработчиком) — используем его.
    reuseExistingServer: true,
    // Холодный старт Vite в CI/песочнице может быть долгим.
    timeout: 120_000,
  },
});
