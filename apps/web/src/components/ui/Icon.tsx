import type { EmotionIcon } from "@emotion-icons/emotion-icon";
import { useTheme } from "emotion-theming";
import React, { forwardRef, useEffect, useState } from "react";
import { Box, type BoxProps } from "rebass";
import type { Theme } from "@/themes/types";

interface IconProps extends Omit<BoxProps, keyof HTMLDivElement | "css"> {
  component: EmotionIcon;
  disabled?: boolean;
  size?: number | string;
}

export const Icon = forwardRef<HTMLDivElement, IconProps>((props, buttonRef) => {
  const { component: IconComponent, size = "1.5em", children, ...extraProps } = props;
  const [containerSize, setSize] = useState<number | string>(size || 0);
  const theme = useTheme<Theme>();

  useEffect(() => {
    if (!size && buttonRef && "current" in buttonRef) {
      setSize(buttonRef.current?.offsetWidth || 0);
    }
  }, [buttonRef, size]);

  return (
    <Box {...extraProps} ref={buttonRef}>
      <IconComponent color={theme.colors?.text} size={containerSize} />
    </Box>
  );
});
