// Браузерный регрессионный тест ForkMeOnGitHub (vitest browser mode, chromium).
// Клик по ссылке не пробуем: это навигация в реальный github.com (target=_blank),
// регрессия — на href и видимость бейджа.
import React from "react";
import { expect, test } from "vitest";
import { mountBrowser } from "../browser-test-utils";
import { ForkMeOnGitHub } from "./index";

test("ForkMeOnGitHub: бейдж ссылки виден, href на GitHub", async () => {
  const { screen } = mountBrowser(<ForkMeOnGitHub />);
  const link = screen.getByRole("link", { name: "Fork me on GitHub" });
  await expect.element(link).toBeVisible();
  await expect
    .element(link)
    .toHaveAttribute("href", "https://github.com/Apkawa/react-fertilizer-calculator");
});

test("ForkMeOnGitHub: ARIA-снапшот базового состояния", async () => {
  const { screen } = mountBrowser(<ForkMeOnGitHub />);
  await expect.element(screen.getByRole("link")).toMatchAriaSnapshot();
});
