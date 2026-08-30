import { within } from "@testing-library/react";
import React from "react";
import { renderApp } from "@/test-utils/render";
import { TabMenu } from "./TabMenu";

// Смоук: меню рендерится. В jsdom окно 1024px → сайдбар не докнут,
// видим только кнопку-бургер (ссылки скрыты внутри закрытого оверлея).
test("TabMenu smoke: меню рендерит кнопку-бургер", () => {
  const { container } = renderApp(<TabMenu colorMode="default" onColorModeChange={() => {}} />);
  expect(container.querySelector("svg")).not.toBeNull();
});

// a11y (stage 2): бургер — настоящая кнопка с доступным именем
// (ранее кликабельный div-Icon — хрупкий локейтор div:has(> svg) в e2e).
test("TabMenu: бургер — кнопка с доступным именем «Меню»", () => {
  const { container } = renderApp(<TabMenu colorMode="default" onColorModeChange={() => {}} />);
  expect(within(container).getByRole("button", { name: "Меню" })).not.toBeNull();
}, 15000);
