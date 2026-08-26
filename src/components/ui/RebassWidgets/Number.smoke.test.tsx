import React from "react";
import { renderApp } from "@/test-utils/render";
import { NumberInput } from "./Number";

test("components/ui/RebassWidgets/Number smoke: числовой инпут рендерится", () => {
  const { container } = renderApp(<NumberInput value={1} />);
  const input = container.querySelector("input");
  expect(input).not.toBeNull();
  expect(input?.value).toBe("1");
}, 15000);
