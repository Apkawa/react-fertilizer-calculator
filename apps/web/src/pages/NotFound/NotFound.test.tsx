import React from "react";
import { renderApp } from "@/test-utils/render";
import NotFound from "./index";

test("pages/NotFound smoke: страница 404 рендерится", () => {
  const { container } = renderApp(<NotFound />);
  expect(container.textContent).toContain("Not found");
}, 15000);
