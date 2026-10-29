import { fireEvent, render } from "@testing-library/react";
import React, { type FunctionComponent } from "react";
import { applyScheme, SCHEMES, type Scheme, type SchemeId, useColorScheme } from "./index";

// Тесты НОВОГО контракта схем (TDD «red»: реализация ещё не написана).
// SchemeId = "default" | "win95" | "retro" | "nature" | "science";
// дефолт "default"; хранимый ключ ui:color-scheme; html[data-scheme];
// неизвестный id трактуется как "default"; реестр SCHEMES — default первым,
// labels по-русски (По умолчанию, Windows 95, Ретро, Природа, Наука).

/** Проба: сохранённая схема + кнопки выбора (как переключатель схем в приложении). */
const Probe: FunctionComponent = () => {
  const [scheme, setScheme] = useColorScheme();
  return (
    <div>
      <span data-testid="scheme">{scheme}</span>
      <button type="button" onClick={() => setScheme("win95")}>
        win95
      </button>
      <button type="button" onClick={() => setScheme("default")}>
        default
      </button>
    </div>
  );
};

beforeEach(() => {
  localStorage.clear();
  document.documentElement.removeAttribute("data-scheme");
});

afterEach(() => {
  document.documentElement.removeAttribute("data-scheme");
});

test("нет сохранённой схемы → дефолт default, атрибут data-scheme = default", () => {
  const { getByTestId } = render(<Probe />);
  expect(getByTestId("scheme").textContent).toBe("default");
  expect(document.documentElement.getAttribute("data-scheme")).toBe("default");
});

test('setScheme("win95") пишет атрибут data-scheme и ключ ui:color-scheme', () => {
  const { getByRole, getByTestId } = render(<Probe />);
  fireEvent.click(getByRole("button", { name: "win95" }));
  expect(getByTestId("scheme").textContent).toBe("win95");
  expect(document.documentElement.getAttribute("data-scheme")).toBe("win95");
  expect(localStorage.getItem("ui:color-scheme")).toBe("win95");
});

test('setScheme("default") после win95 возвращает атрибут и ключ в default', () => {
  localStorage.setItem("ui:color-scheme", "win95");
  const { getByRole, getByTestId } = render(<Probe />);
  expect(getByTestId("scheme").textContent).toBe("win95");
  fireEvent.click(getByRole("button", { name: "default" }));
  expect(getByTestId("scheme").textContent).toBe("default");
  expect(document.documentElement.getAttribute("data-scheme")).toBe("default");
  expect(localStorage.getItem("ui:color-scheme")).toBe("default");
});

test("сохранённая схема восстанавливается (nature)", () => {
  localStorage.setItem("ui:color-scheme", "nature");
  const { getByTestId } = render(<Probe />);
  expect(getByTestId("scheme").textContent).toBe("nature");
  expect(document.documentElement.getAttribute("data-scheme")).toBe("nature");
});

test("неизвестный сохранённый id трактуется как default", () => {
  localStorage.setItem("ui:color-scheme", "bogus");
  const { getByTestId } = render(<Probe />);
  expect(getByTestId("scheme").textContent).toBe("default");
  expect(document.documentElement.getAttribute("data-scheme")).toBe("default");
});

test("applyScheme — чистая функция до монтирования: ставит data-scheme", () => {
  applyScheme("retro");
  expect(document.documentElement.getAttribute("data-scheme")).toBe("retro");
  applyScheme("science");
  expect(document.documentElement.getAttribute("data-scheme")).toBe("science");
});

test("applyScheme неизвестного id трактуется как default", () => {
  applyScheme("bogus");
  expect(document.documentElement.getAttribute("data-scheme")).toBe("default");
});

test("SCHEMES: default первым, полный порядок и русские labels", () => {
  const expected: Scheme[] = [
    { id: "default", label: "По умолчанию" },
    { id: "win95", label: "Windows 95" },
    { id: "retro", label: "Ретро" },
    { id: "nature", label: "Природа" },
    { id: "science", label: "Наука" },
  ];
  expect(SCHEMES).toEqual(expected);
});

test("SchemeId — id из реестра пригоден для setScheme", () => {
  // Sanity: каждый id реестра — валидный SchemeId и применяется атрибутом.
  const ids: SchemeId[] = SCHEMES.map((s) => s.id);
  expect(ids).toEqual(["default", "win95", "retro", "nature", "science"]);
});
