import { Icon, type IconName } from "@fertilizer/icons";
import type { ColorMode } from "@fertilizer/ui";
import React, { type FunctionComponent } from "react";

type ColorModeProps = {
  colorMode: ColorMode;
  onColorModeChange: (mode: ColorMode) => void;
};

// Цикл намерений: light → dark → system → light.
const NEXT_MODE: Record<ColorMode, ColorMode> = { light: "dark", dark: "system", system: "light" };

// Иконка отражает НАМЕРЕНИЕ (не резолв): light — солнце, dark — полумесяц,
// system — «монитор» (redesign §5, glyph из макета apps/web-design).
const ICON_BY_MODE: Record<ColorMode, IconName> = {
  light: "sun",
  dark: "moon",
  system: "monitor",
};

// Тумблер режима цвета. Намерением владеет Root (useColorMode из
// @fertilizer/ui) — здесь только переключение по циклу.
// Настоящая кнопка с доступным именем и aria-pressed (a11y stage 2):
// нажата, когда включён тёмный режим (намерение dark); light и system — не нажаты.
export const ColorModeToggle: FunctionComponent<ColorModeProps> = ({
  colorMode,
  onColorModeChange,
}) => {
  return (
    <button
      type="button"
      className="cursor-pointer bg-transparent p-0 border-0"
      aria-label="Переключить тему"
      title="Переключить тему"
      aria-pressed={colorMode === "dark"}
      onClick={() => onColorModeChange(NEXT_MODE[colorMode])}
    >
      <Icon name={ICON_BY_MODE[colorMode]} size={42} />
    </button>
  );
};
