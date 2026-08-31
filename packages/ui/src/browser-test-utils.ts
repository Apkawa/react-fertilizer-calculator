// Хелпер браузерных регрессионных тестов (vitest browser mode, chromium).
// Мост для React 16 (vitest-browser-react требует React 18+): render из
// @testing-library/react + page.elementLocator — см. docs/vite-browser/component-testing.md.
import { cleanup, render } from "@testing-library/react";
import type { ReactElement } from "react";
import { afterEach } from "vitest";
import { page } from "vitest/browser";

// Особость RTL v12: без явного container baseElement по умолчанию — document.body,
// и screen видел бы DOM других тестов. Поэтому рендерим в собственный container
// и scope-им screen именно на него.
export function mountBrowser(ui: ReactElement) {
  const container = document.createElement("div");
  document.body.appendChild(container);
  render(ui, { container });
  const screen = page.elementLocator(container);
  return { container, screen };
}

// Размонтируем React 16-корни между тестами (авто-чистка RTL в browser mode
// не работает — без явной cleanup тесты видят DOM друг друга)
afterEach(cleanup);
