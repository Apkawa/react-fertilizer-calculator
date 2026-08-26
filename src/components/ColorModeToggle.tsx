import { Moon } from "@styled-icons/boxicons-solid/Moon";
import { Sun } from "@styled-icons/fa-solid/Sun";
import React, { type FunctionComponent } from "react";
import { useColorMode } from "theme-ui";

type ColorModeProps = {};

export const ColorModeToggle: FunctionComponent<ColorModeProps> = () => {
  const [colorMode, setColorMode] = useColorMode();
  const Icon = colorMode === "default" ? Moon : Sun;
  return (
    <Icon
      onClick={() => {
        setColorMode(colorMode === "default" ? "dark" : "default");
      }}
      size={42}
      color={"text"}
    />
  );
};
