import React from "react";
import { renderApp } from "@/test-utils/render";
import Example from "./index";

test("pages/Example smoke: страница примера рендерится", () => {
  const { container } = renderApp(<Example />);
  expect(container.textContent).toContain("On the other hand, we denounce");
}, 15000);
