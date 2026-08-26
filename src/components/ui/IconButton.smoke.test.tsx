import { Plus } from "@styled-icons/boxicons-regular/Plus";
import React from "react";
import { renderApp } from "@/test-utils/render";
import { IconButton } from "./IconButton";

test("components/ui/IconButton smoke: кнопка с иконкой рендерится", () => {
  const { container } = renderApp(<IconButton component={Plus} title="Добавить" />);
  const button = container.querySelector("button");
  expect(button).not.toBeNull();
  expect(button?.querySelector("svg")).not.toBeNull();
}, 15000);
