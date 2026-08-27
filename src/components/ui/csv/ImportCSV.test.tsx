import React from "react";
import { renderApp } from "@/test-utils/render";
import { ImportCSV } from "./ImportCSV";

test("components/ui/csv/ImportCSV smoke: компонент рендерится", () => {
  const { container } = renderApp(<ImportCSV />);
  expect(container.firstChild).not.toBeNull();
}, 15000);
