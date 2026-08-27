import React from "react";
import { Icon } from "../Icon";
import { IconButton } from "../IconButton";
import { renderIcons } from "../test-utils/render";

test("components/ui/IconButton smoke: кнопка с иконкой рендерится", () => {
  const { container } = renderIcons(<IconButton name="plus" title="Добавить" />);
  const button = container.querySelector("button");
  expect(button).not.toBeNull();
  expect(button?.querySelector("svg")).not.toBeNull();
});

test("components/ui/Icon smoke: иконка по имени рендерится в div со svg", () => {
  const { container } = renderIcons(<Icon name="trash" />);
  const div = container.querySelector("div");
  expect(div).not.toBeNull();
  const svg = div?.querySelector("svg");
  expect(svg).not.toBeNull();
  // e2e-контракт (playwright): svg — прямой ребёнок div-обёртки
  expect(svg?.parentElement).toBe(div);
});
