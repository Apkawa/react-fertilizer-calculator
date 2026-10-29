import React from "react";
import { cx } from "../cx";
import css from "./style.module.css";

export type ElementCellProps = {
  name: string;
  value: string | number;
  delta?: string;
  className?: string;
};

// Знак дельты по канону §3.3: «+» → plus (--ok); «-» (ascii, юзер-ввод формы)
// и «−» (U+2212, типографский минус) → minus (--deficit); «0» и значение без
// знака → нейтральная (--muted) — атрибута знака нет.
function deltaSign(delta: string): "plus" | "minus" | undefined {
  if (delta.startsWith("+")) return "plus";
  if (delta.startsWith("-") || delta.startsWith("−")) return "minus";
  return undefined;
}

// Ячейка элемента в результате (канон §3.3): 3 ряда по порядку — name → value
// → delta (дельта рендерится только когда передана). Дельта БЕЗ символа «Δ» —
// только знаковое значение. Знак — стабильный контракт: data-delta="plus|minus"
// на элементе дельта (окраска по знаку — css). Хук data-ui="element-cell" —
// точка таргета схем. Тон подложки/рамки от --el-tint (класс .el-* снаружи),
// текст НЕ красится по элементу — единый var(--text) (канон §5).
export const ElementCell = ({ name, value, delta, className }: ElementCellProps) => {
  const sign = delta === undefined ? undefined : deltaSign(delta);
  return (
    <div className={cx(css.elementCell, className)} data-ui="element-cell">
      <span className={css.name}>{name}</span>
      <span className={css.value}>{value}</span>
      {delta !== undefined && (
        <span
          className={cx(
            css.delta,
            sign === "plus" && css.deltaPlus,
            sign === "minus" && css.deltaMinus,
          )}
          data-delta={sign}
        >
          {delta}
        </span>
      )}
    </div>
  );
};
