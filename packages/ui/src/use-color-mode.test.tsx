import { fireEvent, render } from "@testing-library/react";
import React, { type FunctionComponent } from "react";
import { useColorMode } from "./use-color-mode";

/** Проба: текущий режим + кнопка-переключатель (как ColorModeToggle в приложении). */
const Probe: FunctionComponent = () => {
  const [mode, setMode] = useColorMode();
  return (
    <div>
      <span data-testid="mode">{mode}</span>
      <button type="button" onClick={() => setMode(mode === "default" ? "dark" : "default")}>
        toggle
      </button>
    </div>
  );
};

test("нет сохранённого режима → light, атрибут data-theme применяется", () => {
  const { getByTestId } = render(<Probe />);
  expect(getByTestId("mode").textContent).toBe("default");
  expect(document.documentElement.getAttribute("data-theme")).toBe("default");
});

test("новый ключ localStorage восстанавливается", () => {
  localStorage.setItem("ui:color-mode", "dark");
  const { getByTestId } = render(<Probe />);
  expect(getByTestId("mode").textContent).toBe("dark");
  expect(document.documentElement.getAttribute("data-theme")).toBe("dark");
});

test("legacy-ключ старой темы мигрируется в новый ключ", () => {
  localStorage.setItem("theme-ui:mode", "dark");
  const { getByTestId } = render(<Probe />);
  expect(getByTestId("mode").textContent).toBe("dark");
  expect(localStorage.getItem("ui:color-mode")).toBe("dark");
});

test("новый ключ важнее legacy (пользователь уже сменил режим после миграции)", () => {
  localStorage.setItem("theme-ui:mode", "dark");
  localStorage.setItem("ui:color-mode", "default");
  const { getByTestId } = render(<Probe />);
  expect(getByTestId("mode").textContent).toBe("default");
  expect(localStorage.getItem("ui:color-mode")).toBe("default");
});

test("переключатель меняет режим, атрибут и запись в localStorage", () => {
  const { getByRole, getByTestId } = render(<Probe />);
  expect(getByTestId("mode").textContent).toBe("default");
  fireEvent.click(getByRole("button"));
  expect(getByTestId("mode").textContent).toBe("dark");
  expect(document.documentElement.getAttribute("data-theme")).toBe("dark");
  expect(localStorage.getItem("ui:color-mode")).toBe("dark");
});
