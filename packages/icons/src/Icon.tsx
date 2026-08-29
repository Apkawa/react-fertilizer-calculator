import React, { forwardRef, type HTMLAttributes, useEffect, useState } from "react";
import { type IconName, icons } from "./registry";

interface IconProps extends HTMLAttributes<HTMLDivElement> {
  /** Имя иконки из реестра (plus, trash, close, …). */
  name: IconName;
  /** Цвет иконки; по умолчанию — текущий цвет текста (currentColor). */
  color?: string;
  disabled?: boolean;
  size?: number | string;
}

/**
 * Иконка из собственного набора, выбирается по имени.
 * svg обёрнут в div — e2e-селекторы playwright ждут div с единственным svg-ребёнком.
 */
export const Icon = forwardRef<HTMLDivElement, IconProps>((props, ref) => {
  const { name, size = "1.5em", color, children, ...extraProps } = props;
  const [containerSize, setSize] = useState<number | string>(size ?? 0);

  useEffect(() => {
    if (!size && ref && "current" in ref) {
      setSize(ref.current?.offsetWidth || 0);
    }
  }, [ref, size]);

  const IconComponent = icons[name];
  return (
    <div {...extraProps} ref={ref}>
      <IconComponent size={containerSize} color={color} />
    </div>
  );
});
