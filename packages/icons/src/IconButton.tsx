import { Button, cx } from "@fertilizer/ui";
import React, {
  type ButtonHTMLAttributes,
  type CSSProperties,
  forwardRef,
  type PropsWithChildren,
  useEffect,
  useState,
} from "react";
import { type IconName, icons } from "./registry";

// Space-шкала polaris ([0,4,8,16,32,64,128] px): индекс токена → суффикс tailwind-класса
const SPACE: Record<number, string> = { 0: "0", 1: "1", 2: "2", 3: "4", 4: "8", 5: "16", 6: "32" };
// flex alignSelf (лёгасный проп) → tailwind
const ALIGN_SELF: Record<string, string> = {
  center: "self-center",
  start: "self-start",
  "flex-start": "self-start",
  end: "self-end",
  "flex-end": "self-end",
};
// Токены темы theme-ui (фон кнопки) → CSS-переменные @fertilizer/ui (theme.css)
const BG_TOKENS: Record<string, string> = {
  primary: "var(--color-primary)",
  danger: "var(--color-danger)",
};

interface IconButtonProps extends PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement>> {
  /** Имя иконки из реестра (plus, trash, close, …). */
  name: IconName;
  /** Цвет иконки; по умолчанию — текущий цвет текста (currentColor). */
  color?: string;
  size?: number | string;
  /** Лёгасный (rebass): space-шкала → padding. */
  padding?: number;
  /** Лёгасный (rebass): flex alignSelf. */
  alignSelf?: string;
  /** Лёгасный (rebass): space-шкала → margin-right. */
  marginRight?: number;
  /** Лёгасный (theme-ui): токен темы (primary/danger) или CSS-цвет. */
  backgroundColor?: string;
}

/**
 * Кнопка с иконкой из собственного набора (packages/ui Button).
 * С children — иконка + подпись (иконка получает отступ справа).
 */
export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>((props, ref) => {
  const {
    name,
    size = "1.5em",
    color,
    children,
    className,
    style,
    padding,
    alignSelf,
    marginRight,
    backgroundColor,
    ...extraProps
  } = props;
  const [containerSize, setSize] = useState<number | string>(size ?? 0);

  useEffect(() => {
    if (!size && ref && "current" in ref) {
      setSize(ref.current?.offsetWidth || 0);
    }
  }, [ref, size]);

  // Лёгасные layout-пропы → tailwind-классы; токен фона — arbitrary-класс
  // (var() не парсится jsdom/cssstyle, браузер резолвит сам)
  const legacy: string[] = [];
  let bgStyle: CSSProperties = {};
  if (padding !== undefined) {
    legacy.push(`p-${SPACE[padding] ?? "0"}`);
  }
  if (alignSelf !== undefined) {
    legacy.push(ALIGN_SELF[alignSelf] ?? `self-${alignSelf}`);
  }
  if (marginRight !== undefined) {
    legacy.push(`mr-${SPACE[marginRight] ?? "0"}`);
  }
  const bgToken = backgroundColor !== undefined ? BG_TOKENS[backgroundColor] : undefined;
  if (bgToken !== undefined) {
    legacy.push(`bg-[${bgToken}]`);
  } else if (backgroundColor !== undefined) {
    bgStyle = { backgroundColor };
  }

  const IconComponent = icons[name];
  return (
    <Button
      type="button"
      ref={ref}
      className={cx(legacy, className)}
      style={{ ...bgStyle, ...style }}
      {...extraProps}
    >
      <IconComponent size={containerSize} color={color} style={{ marginRight: children ? 2 : 0 }} />
      {children}
    </Button>
  );
});
