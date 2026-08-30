import type { ColorMode } from "@fertilizer/ui";
import { fireEvent, within } from "@testing-library/react";
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

// a11y (stage 2): тумблер — настоящая <button> с доступным именем,
// aria-pressed отражает текущий режим (dark = нажат).
test("components/ColorModeToggle: <button> с именем и aria-pressed по режиму", () => {
  const { container } = renderApp(
    <ColorModeToggle colorMode="default" onColorModeChange={() => {}} />,
  );
  const light = within(container).getByRole("button", { name: "Переключить тему" });
  expect(light).toHaveAttribute("aria-pressed", "false");

  const { container: darkContainer } = renderApp(
    <ColorModeToggle colorMode="dark" onColorModeChange={() => {}} />,
  );
  const dark = within(darkContainer).getByRole("button", { name: "Переключить тему" });
  expect(dark).toHaveAttribute("aria-pressed", "true");
}, 15000);
