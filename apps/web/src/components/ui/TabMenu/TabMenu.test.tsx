import React from "react";
import { renderApp } from "@/test-utils/render";
import { TabMenu } from "./TabMenu";

// Смоук: меню рендерится. В jsdom окно 1024px → сайдбар не докнут,
// видим только кнопку-бургер (ссылки скрыты внутри закрытого оверлея).
test("components/ui/TabMenu smoke: меню рендерит кнопку-бургер", () => {
  const { container } = renderApp(<TabMenu />);
  expect(container.querySelector("svg")).not.toBeNull();
}, 15000);
