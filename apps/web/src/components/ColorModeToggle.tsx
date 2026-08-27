import { Icon } from "@fertilizer/icons";
import React, { type FunctionComponent } from "react";
import { useColorMode } from "theme-ui";

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
