import type { CSSProperties } from "react";

/** Пропы собственных svg-иконок (сетка 24×24). */
export type IconSvgProps = {
  /** Размер: число — px, строка — em и т.п. (по умолчанию 1em). */
  size?: number | string;
  /** Цвет иконки (CSS color); по умолчанию наследуется. */
  color?: string;
  style?: CSSProperties;
};

/** Общие атрибуты svg — единый контракт для всех иконок. */
export function svgProps(size?: number | string, color?: string, style?: CSSProperties) {
  return {
    width: size ?? "1em",
    height: size ?? "1em",
    viewBox: "0 0 24 24",
    color,
    style,
  };
}
