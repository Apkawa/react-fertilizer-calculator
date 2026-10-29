import { SCHEMES, type SchemeId } from "@fertilizer/ui";
import { fireEvent, within } from "@testing-library/react";
import React from "react";
import { vi } from "vitest";
import { renderApp } from "@/test-utils/render";
import { SchemeSelect } from "./SchemeSelect";

// Выбор цветовой схемы (redesign §5): native <select> (appearance-auto),
// options — из реестра SCHEMES, value — текущий schemeId, выбор шлётся вверх.
test("components/SchemeSelect: native select со списком схем и значением", () => {
  const onChange = vi.fn<(id: SchemeId) => void>();
  const { container } = renderApp(<SchemeSelect schemeId="default" onChange={onChange} />);

  const select = within(container).getByRole("combobox", { name: "Цветовая схема" });
  expect(select).toHaveValue("default");

  const options = within(select).getAllByRole("option");
  expect(options).toHaveLength(SCHEMES.length);
  expect(options.map((o) => o.textContent)).toEqual(SCHEMES.map((s) => s.label));

  fireEvent.change(select, { target: { value: "win95" } });
  expect(onChange).toHaveBeenCalledWith("win95");
}, 15000);

// Читабельность popup в тёмной теме (round 10): Chromium красит список select
// по его собственному фону — bg-transparent давал белый popup с светлым
// текстом. Схема = подложка рецепта: непрозрачный --card.
test("components/SchemeSelect: select несёт непрозрачную подложку --card (popup читабелен в dark)", () => {
  const { container } = renderApp(<SchemeSelect schemeId="default" onChange={() => {}} />);
  const select = within(container).getByRole("combobox", { name: "Цветовая схема" });
  expect(select.className).toContain("bg-[var(--card)]");
});
