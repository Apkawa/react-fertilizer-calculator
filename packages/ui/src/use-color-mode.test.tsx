import { act, fireEvent, render } from "@testing-library/react";
import React, { type FunctionComponent } from "react";
import { applyTheme, type ColorMode, useColorMode } from "./index";

// Тесты НОВОГО контракта темы (TDD «red»: реализация ещё не написана).
// ColorMode = "light" | "dark" | "system" — хранимое «намерение»;
// html[data-theme] всегда "light" | "dark"; "system" резолвится по
// matchMedia("(prefers-color-scheme: dark)") и реприменяется на событие change;
// миграции: сохранённое "default" трактуется как "light",
// legacy ключ theme-ui:mode мигрирует в ui:color-mode когда новый ключ пуст.

/** Управляемый fake matchMedia: jsdom не поддерживает prefers-color-scheme. */
interface FakeMediaQueryList {
  media: string;
  matches: boolean;
  addEventListener(type: string, listener: (event: { matches: boolean }) => void): void;
  removeEventListener(type: string, listener: (event: { matches: boolean }) => void): void;
  /** Меняет matches и dispatch-ит событие "change" слушателям хука. */
  setMatches(next: boolean): void;
}

function stubPrefersColorScheme(matches: boolean): FakeMediaQueryList {
  const listeners: Array<(event: { matches: boolean }) => void> = [];
  const mq: FakeMediaQueryList = {
    media: "(prefers-color-scheme: dark)",
    matches,
    addEventListener(_type, listener) {
      listeners.push(listener);
    },
    removeEventListener(_type, listener) {
      const index = listeners.indexOf(listener);
      if (index >= 0) listeners.splice(index, 1);
    },
    setMatches(next) {
      mq.matches = next;
      listeners.forEach((listener) => {
        listener({ matches: next });
      });
    },
  };
  vi.stubGlobal("matchMedia", () => mq);
  return mq;
}

const MODES: ColorMode[] = ["light", "dark", "system"];

/** Проба: хранимое намерение + кнопки выбора режима (как переключатель в приложении). */
const Probe: FunctionComponent = () => {
  const [mode, setMode] = useColorMode();
  return (
    <div>
      <span data-testid="mode">{mode}</span>
      {MODES.map((m) => (
        <button key={m} type="button" onClick={() => setMode(m)}>
          {m}
        </button>
      ))}
    </div>
  );
};

beforeEach(() => {
  localStorage.clear();
  document.documentElement.removeAttribute("data-theme");
});

afterEach(() => {
  vi.unstubAllGlobals();
  document.documentElement.removeAttribute("data-theme");
});

test("нет сохранённого режима → намерение light, атрибут data-theme = light", () => {
  const { getByTestId } = render(<Probe />);
  expect(getByTestId("mode").textContent).toBe("light");
  expect(document.documentElement.getAttribute("data-theme")).toBe("light");
});

test("сохранённый dark восстанавливается: намерение dark, атрибут dark", () => {
  localStorage.setItem("ui:color-mode", "dark");
  const { getByTestId } = render(<Probe />);
  expect(getByTestId("mode").textContent).toBe("dark");
  expect(document.documentElement.getAttribute("data-theme")).toBe("dark");
});

test("сохранённый system: намерение system, атрибут резолвится по prefers-color-scheme (matches=false → light)", () => {
  stubPrefersColorScheme(false);
  localStorage.setItem("ui:color-mode", "system");
  const { getByTestId } = render(<Probe />);
  expect(getByTestId("mode").textContent).toBe("system");
  expect(document.documentElement.getAttribute("data-theme")).toBe("light");
});

test("сохранённый system с prefers dark=true резолвится в атрибут dark", () => {
  stubPrefersColorScheme(true);
  localStorage.setItem("ui:color-mode", "system");
  const { getByTestId } = render(<Probe />);
  expect(getByTestId("mode").textContent).toBe("system");
  expect(document.documentElement.getAttribute("data-theme")).toBe("dark");
});

test('setMode("system") хранит намерение system и резолвит атрибут', () => {
  stubPrefersColorScheme(true);
  const { getByRole, getByTestId } = render(<Probe />);
  fireEvent.click(getByRole("button", { name: "system" }));
  expect(getByTestId("mode").textContent).toBe("system");
  expect(localStorage.getItem("ui:color-mode")).toBe("system");
  expect(document.documentElement.getAttribute("data-theme")).toBe("dark");
});

test('setMode("dark") хранит намерение dark даже при prefers dark=false', () => {
  stubPrefersColorScheme(false);
  const { getByRole, getByTestId } = render(<Probe />);
  fireEvent.click(getByRole("button", { name: "dark" }));
  expect(getByTestId("mode").textContent).toBe("dark");
  expect(localStorage.getItem("ui:color-mode")).toBe("dark");
  expect(document.documentElement.getAttribute("data-theme")).toBe("dark");
});

test("change события matchMedia в режиме system реприменяют атрибут light↔dark", () => {
  const mq = stubPrefersColorScheme(false);
  const { getByRole, getByTestId } = render(<Probe />);
  fireEvent.click(getByRole("button", { name: "system" }));
  expect(getByTestId("mode").textContent).toBe("system");
  expect(document.documentElement.getAttribute("data-theme")).toBe("light");

  act(() => mq.setMatches(true));
  expect(document.documentElement.getAttribute("data-theme")).toBe("dark");
  expect(getByTestId("mode").textContent).toBe("system"); // намерение не меняется

  act(() => mq.setMatches(false));
  expect(document.documentElement.getAttribute("data-theme")).toBe("light");
});

test("в режиме light события matchMedia не меняют атрибут (намерение важнее системы)", () => {
  const mq = stubPrefersColorScheme(false);
  const { getByRole, getByTestId } = render(<Probe />);
  fireEvent.click(getByRole("button", { name: "light" }));
  expect(document.documentElement.getAttribute("data-theme")).toBe("light");
  act(() => mq.setMatches(true));
  expect(document.documentElement.getAttribute("data-theme")).toBe("light");
  expect(getByTestId("mode").textContent).toBe("light");
});

test('сохранённое "default" в ui:color-mode трактуется как light', () => {
  localStorage.setItem("ui:color-mode", "default");
  const { getByTestId } = render(<Probe />);
  expect(getByTestId("mode").textContent).toBe("light");
  expect(document.documentElement.getAttribute("data-theme")).toBe("light");
});

test('legacy theme-ui:mode="dark" мигрирует в ui:color-mode, если новый ключ пуст', () => {
  localStorage.setItem("theme-ui:mode", "dark");
  const { getByTestId } = render(<Probe />);
  expect(getByTestId("mode").textContent).toBe("dark");
  expect(document.documentElement.getAttribute("data-theme")).toBe("dark");
  expect(localStorage.getItem("ui:color-mode")).toBe("dark");
});

test('legacy theme-ui:mode="default" мигрирует и трактуется как light', () => {
  localStorage.setItem("theme-ui:mode", "default");
  const { getByTestId } = render(<Probe />);
  expect(getByTestId("mode").textContent).toBe("light");
  expect(document.documentElement.getAttribute("data-theme")).toBe("light");
  // Миграция состоялась; конкретное значение ("light" или "default") нормализуется на чтении.
  expect(localStorage.getItem("ui:color-mode")).not.toBeNull();
});

test("новый ключ важнее legacy-ключа", () => {
  stubPrefersColorScheme(false);
  localStorage.setItem("theme-ui:mode", "dark");
  localStorage.setItem("ui:color-mode", "system");
  const { getByTestId } = render(<Probe />);
  expect(getByTestId("mode").textContent).toBe("system");
  expect(document.documentElement.getAttribute("data-theme")).toBe("light");
  expect(localStorage.getItem("ui:color-mode")).toBe("system");
});

test("applyTheme — чистая функция до монтирования: dark/light ставят атрибут", () => {
  applyTheme("dark");
  expect(document.documentElement.getAttribute("data-theme")).toBe("dark");
  applyTheme("light");
  expect(document.documentElement.getAttribute("data-theme")).toBe("light");
});

test('applyTheme("system") резолвится по prefers-color-scheme', () => {
  const mq = stubPrefersColorScheme(true);
  applyTheme("system");
  expect(document.documentElement.getAttribute("data-theme")).toBe("dark");

  mq.matches = false; // без dispatch: повторный вызов резолвит заново
  applyTheme("system");
  expect(document.documentElement.getAttribute("data-theme")).toBe("light");
});
