import { Button, cx } from "@fertilizer/ui";
import React, {
  type ButtonHTMLAttributes,
  type CSSProperties,
  forwardRef,
  type PropsWithChildren,
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
// Токены темы старой дизайн-системы (фон кнопки) → core-токены @fertilizer/ui
// (theme.css: --primary, --danger)
const BG_TOKENS: Record<string, string> = {
  primary: "var(--primary)",
  danger: "var(--danger)",
};

interface IconButtonProps extends PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement>> {
  /** Имя иконки из реестра (plus, trash, close, …). */
  name: IconName;
  /** Цвет иконки; по умолчанию — текущий цвет текста (currentColor). */
  color?: string;
  size?: number | string;
  /** Лёгасный layout-проп (старая дизайн-система): space-шкала → padding. */
  padding?: number;
  /** Лёгасный layout-проп (старая дизайн-система): flex alignSelf. */
  alignSelf?: string;
  /** Лёгасный layout-проп (старая дизайн-система): space-шкала → margin-right. */
  marginRight?: number;
  /** Лёгасный проп: токен темы (primary/danger) или CSS-цвет. */
  backgroundColor?: string;
  /** Непрозрачный фон --card (round 14): поверх просвечивающего tint Button —
   * для контролов, стоящих над контентом (закрытие сайдбара поверх меню). */
  solid?: boolean;
}

/**
 * Кнопка с иконкой из собственного набора (packages/ui Button).
 * С children — иконка + подпись (иконка получает отступ справа).
 */
export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>((props, ref) => {
  const {
    name,
    size,
    color,
    children,
    className,
    style,
    padding,
    alignSelf,
    marginRight,
    backgroundColor,
    solid,
    title,
    // Явный title от коньюмера — в приоритете; без него тултип берётся из aria-label
    "aria-label": ariaLabel,
    ...extraProps
  } = props;

  // Канон иконко-кнопки (§3.1, макет .icon-btn): icon-only кнопка — квадрат
  // 2.5rem×2.5rem с svg 24px. Инлайн стиль перебивает padding базы Button
  // независимо от каскада слоёв; с children (текстом) канон не форсируется.
  const iconOnly = children === undefined;
  const iconSize = size ?? (iconOnly ? "1.5rem" : "1.5em");
  const squareStyle: CSSProperties = iconOnly
    ? { width: "2.5rem", paddingLeft: 0, paddingRight: 0 }
    : {};

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
  // solid — inline фон --card поверх прозрачного tint Button (inline перебивает
  // каскад слоёв; hover tint базы не работает — border/focus остаются).
  // Inline, не tailwind-класс: browser-тесты проверяют резолв токена без
  // сборки tailwind utilities.
  if (solid) {
    bgStyle = { ...bgStyle, backgroundColor: "var(--card)" };
  }

  const IconComponent = icons[name];
  return (
    <Button
      type="button"
      ref={ref}
      className={cx(legacy, className)}
      style={{ ...squareStyle, ...bgStyle, ...style }}
      aria-label={ariaLabel}
      title={title ?? ariaLabel}
      {...extraProps}
    >
      <IconComponent size={iconSize} color={color} style={{ marginRight: children ? 2 : 0 }} />
      {children}
    </Button>
  );
});
