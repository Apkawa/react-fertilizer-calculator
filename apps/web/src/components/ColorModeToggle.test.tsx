import type { ColorMode } from "@fertilizer/ui";
import { fireEvent } from "@testing-library/react";
import React from "react";
import { renderApp } from "@/test-utils/render";
import { ColorModeToggle } from "./ColorModeToggle";

test("components/ColorModeToggle: рендерится и шлёт новый режим вверх", () => {
  const calls: ColorMode[] = [];
  const { container } = renderApp(
    <ColorModeToggle colorMode="default" onColorModeChange={(m) => calls.push(m)} />,
  );
  // Клик по иконке → смена "default" → "dark"
  fireEvent.click(container.querySelector("svg")!);
  expect(calls).toEqual(["dark"]);
}, 15000);
