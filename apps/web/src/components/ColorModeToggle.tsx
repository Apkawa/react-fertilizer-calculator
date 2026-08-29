import { Icon } from "@fertilizer/icons";
import type { ColorMode } from "@fertilizer/ui";
import React, { type FunctionComponent } from "react";

type ColorModeProps = {
  colorMode: ColorMode;
  onColorModeChange: (mode: ColorMode) => void;
};

// Тумблер режима цвета (иконка луна/солнце). Режимом владеет Root
// (useColorMode из @fertilizer/ui) — здесь только переключение.
export const ColorModeToggle: FunctionComponent<ColorModeProps> = ({
  colorMode,
  onColorModeChange,
}) => {
  return (
    <Icon
      name={colorMode === "default" ? "moon" : "sun"}
      size={42}
      onClick={() => {
        onColorModeChange(colorMode === "default" ? "dark" : "default");
      }}
    />
  );
};
