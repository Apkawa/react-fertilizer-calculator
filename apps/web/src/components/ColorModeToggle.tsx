import { Icon } from "@fertilizer/icons";
import { useColorMode } from "@fertilizer/ui";
import React, { type FunctionComponent } from "react";

type ColorModeProps = {};

export const ColorModeToggle: FunctionComponent<ColorModeProps> = () => {
  const [colorMode, setColorMode] = useColorMode();
  return (
    <Icon
      name={colorMode === "default" ? "moon" : "sun"}
      size={42}
      onClick={() => {
        setColorMode(colorMode === "default" ? "dark" : "default");
      }}
    />
  );
};
