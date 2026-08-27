import React, {
  forwardRef,
  type MouseEventHandler,
  type PropsWithChildren,
  useEffect,
  useState,
} from "react";
import { Button, type ButtonProps } from "rebass";
import { type IconName, icons } from "./registry";

interface IconButtonProps extends PropsWithChildren<Omit<ButtonProps, "css">> {
  /** Имя иконки из реестра (plus, trash, close, …). */
  name: IconName;
  /** Цвет иконки; по умолчанию — текущий цвет текста (currentColor). */
  color?: string;
  disabled?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  size?: number | string;
  title?: string;
}

/**
 * Кнопка с иконкой из собственного набора (rebass Button).
 * С children — иконка + подпись (иконка получает отступ справа).
 */
export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>((props, ref) => {
  const { name, size = "1.5em", color, children, ...extraProps } = props;
  const [containerSize, setSize] = useState<number | string>(size ?? 0);

  useEffect(() => {
    if (!size && ref && "current" in ref) {
      setSize(ref.current?.offsetWidth || 0);
    }
  }, [ref, size]);

  const IconComponent = icons[name];
  let marginRight = 0;
  if (children) {
    marginRight = 2;
  }
  return (
    <Button type="button" {...extraProps} ref={ref}>
      <IconComponent size={containerSize} color={color} style={{ marginRight }} />
      {children}
    </Button>
  );
});
