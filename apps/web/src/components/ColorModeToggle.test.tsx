import type { ColorMode } from "@fertilizer/ui";
import { fireEvent, within } from "@testing-library/react";
import React from "react";
import { renderApp } from "@/test-utils/render";
import { ColorModeToggle } from "./ColorModeToggle";

// Иконка различаем по структуре svg (реестр @fertilizer/icons):
// sun — круг r=4.5 + лучи; moon — полумесяц (без круга); monitor — круг r=8 + залитая левая половина.
function iconShape(container: HTMLElement): { circleR: string | null; paths: number } {
  const svg = container.querySelector("svg")!;
  const circle = svg.querySelector("circle");
  return { circleR: circle?.getAttribute("r") ?? null, paths: svg.querySelectorAll("path").length };
}

test("components/ColorModeToggle: рендерится и шлёт новый режим вверх", () => {
  const calls: ColorMode[] = [];
  const { container } = renderApp(
    <ColorModeToggle colorMode="light" onColorModeChange={(m) => calls.push(m)} />,
  );
  // Клик по иконке → смена "light" → "dark"
  fireEvent.click(container.querySelector("svg")!);
  expect(calls).toEqual(["dark"]);
}, 15000);

// Цикл намерений (redesign §5): light → dark → system → light.
// Компонент контролируемый (намерение живёт снаружи), поэтому цикл
// проверяем через stateful-обёртку — так же, как Root с useColorMode.
function CycleHarness() {
  const [mode, setMode] = React.useState<ColorMode>("light");
  return <ColorModeToggle colorMode={mode} onColorModeChange={setMode} />;
}

test("components/ColorModeToggle: цикл light → dark → system → light", () => {
  const { container } = renderApp(<CycleHarness />);
  const click = () => fireEvent.click(container.querySelector("svg")!);

  expect(iconShape(container)).toEqual({ circleR: "4.5", paths: 1 }); // light: sun
  click(); // light → dark
  expect(iconShape(container)).toEqual({ circleR: null, paths: 1 }); // dark: moon
  click(); // dark → system
  expect(iconShape(container)).toEqual({ circleR: "8", paths: 1 }); // system: monitor
  click(); // system → light
  expect(iconShape(container)).toEqual({ circleR: "4.5", paths: 1 }); // light: sun
}, 15000);

// Иконка отражает НАМЕРЕНИЕ (не резолв): light→sun, dark→moon, system→monitor.
test("components/ColorModeToggle: иконка по намерению — sun/moon/monitor", () => {
  const renderMode = (mode: ColorMode) =>
    renderApp(<ColorModeToggle colorMode={mode} onColorModeChange={() => {}} />).container;

  // light — солнце: круг r=4.5 + лучи
  expect(iconShape(renderMode("light"))).toEqual({ circleR: "4.5", paths: 1 });
  // dark — полумесяц: без круга
  expect(iconShape(renderMode("dark"))).toEqual({ circleR: null, paths: 1 });
  // system — монитор: круг r=8 + залитая половина
  expect(iconShape(renderMode("system"))).toEqual({ circleR: "8", paths: 1 });
}, 15000);

// a11y (stage 2): тумблер — настоящая <button> с доступным именем,
// aria-pressed отражает НАЖАТОЕ состояние: true только при dark (system не «нажат»).
test("components/ColorModeToggle: <button> с именем и aria-pressed по режиму", () => {
  const renderButton = (mode: ColorMode) => {
    const { container } = renderApp(
      <ColorModeToggle colorMode={mode} onColorModeChange={() => {}} />,
    );
    return within(container).getByRole("button", { name: "Переключить тему" });
  };
  expect(renderButton("light")).toHaveAttribute("aria-pressed", "false");
  expect(renderButton("dark")).toHaveAttribute("aria-pressed", "true");
  expect(renderButton("system")).toHaveAttribute("aria-pressed", "false");
}, 15000);

// Тултип при наведении: title = доступное имя (как в IconButton).
test("components/ColorModeToggle: title берётся из aria-label", () => {
  const { container } = renderApp(
    <ColorModeToggle colorMode="light" onColorModeChange={() => {}} />,
  );
  expect(within(container).getByRole("button", { name: "Переключить тему" })).toHaveAttribute(
    "title",
    "Переключить тему",
  );
}, 15000);
