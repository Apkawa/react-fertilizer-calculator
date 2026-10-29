import type { Elements } from "@fertilizer/calculator/types";
import { cx, ElementCell } from "@fertilizer/ui";
import React, { type FunctionComponent } from "react";
import { elementDisplayName, elementTintClass } from "./fertilizerRow";

interface ElementProps {
  name: keyof Elements;
  isOxide?: boolean;
  value: number;
  delta?: number;
}

// Знак дельты по канону §3.3: «+N» и «−N» (U+2212 — как в макете), «0» —
// нейтральная (ElementCell: атрибута знака нет). Символ «Δ» не используется.
const signedDelta = (delta: number): string =>
  delta > 0 ? `+${delta}` : delta < 0 ? `−${Math.abs(delta)}` : "0";

// Элемент результата расчёта — @fertilizer/ui ElementCell (§3.3): три ряда
// name → value → delta. Тон декоративный: класс .el-* из реестра (--el-tint
// для подложки/рамки); текст НЕ красится по элементу. LEGACY ELEMENT_BG
// (hex-подложки) и text-black/text-white удалены — только токены темы (§5).
export const Element: FunctionComponent<ElementProps> = (props) => {
  const { name, value, delta, isOxide } = props;
  return (
    <ElementCell
      // Layout результата (1 ряд × 8) — правка в Stage 6C; здесь сохраняем
      // растягивание ячейки по строке.
      className={cx("min-w-0 flex-1", elementTintClass(name))}
      name={isOxide ? elementDisplayName(name) : name}
      value={value}
      delta={typeof delta === "undefined" ? undefined : signedDelta(delta)}
    />
  );
};
