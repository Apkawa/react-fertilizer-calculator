import React from "react";
import { renderApp } from "@/test-utils/render";
import { ColorModeToggle } from "./ColorModeToggle";

test("components/ColorModeToggle smoke: переключатель темы рендерится", () => {
  const { container } = renderApp(<ColorModeToggle />);
  expect(container.querySelector("svg")).not.toBeNull();
}, 15000);
