import React, { forwardRef, useEffect, useState } from "react";
import { Box, type BoxProps } from "rebass";
import { useThemeUI } from "theme-ui";
import { type IconName, icons } from "./registry";

interface IconProps extends Omit<BoxProps, "css"> {
  /** Имя иконки из реестра (plus, trash, close, …). */
  name: IconName;
  /** Цвет иконки; по умолчанию — цвет текста из темы. */
  color?: string;
  disabled?: boolean;
  size?: number | string;
}

/**
 * Иконка из собственного набора, выбирается по имени.
 * svg обёрнут в Box (div) — e2e-селекторы playwright ждут div с единственным svg-ребёнком.
 */
export const Icon = forwardRef<HTMLDivElement, IconProps>((props, ref) => {
  const { name, size = "1.5em", color, children, ...extraProps } = props;
  const [containerSize, setSize] = useState<number | string>(size ?? 0);
  const { theme } = useThemeUI();

  useEffect(() => {
    if (!size && ref && "current" in ref) {
      setSize(ref.current?.offsetWidth || 0);
    }
  }, [ref, size]);

  const IconComponent = icons[name];
  return (
    <Box {...extraProps} ref={ref}>
      <IconComponent size={containerSize} color={color ?? theme.colors?.text} />
    </Box>
  );
});
