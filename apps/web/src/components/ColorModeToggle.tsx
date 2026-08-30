import { Icon } from "@fertilizer/icons";
import type { ColorMode } from "@fertilizer/ui";
import React, { type FunctionComponent } from "react";

type ColorModeProps = {
  colorMode: ColorMode;
  onColorModeChange: (mode: ColorMode) => void;
};

// Тумблер режима цвета (иконка луна/солнце). Режимом владеет Root
// (useColorMode из @fertilizer/ui) — здесь только переключение.
// Настоящая кнопка с доступным именем и aria-pressed (a11y stage 2):
// нажата, когда включён тёмный режим.
export const ColorModeToggle: FunctionComponent<ColorModeProps> = ({
  colorMode,
  onColorModeChange,
}) => {
  const isDark = colorMode !== "default";
  return (
    <button
      type="button"
      className="cursor-pointer bg-transparent p-0 border-0"
      aria-label="Переключить тему"
      aria-pressed={isDark}
      onClick={() => onColorModeChange(isDark ? "default" : "dark")}
    >
      <Icon name={isDark ? "sun" : "moon"} size={42} />
    </button>
  );
};
