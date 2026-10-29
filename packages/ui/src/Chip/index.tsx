import React from "react";
import { cx } from "../cx";
import css from "./style.module.css";

// Вариант чипа (канон макета §3.2): plain — баланс-чанк (borderless, тон от
// --muted); element — чип состава удобрения (тон/рамка от --el-tint).
export type ChipVariant = "plain" | "element";

export type ChipProps = {
  label: string;
  value: string | number;
  variant?: ChipVariant;
  className?: string;
  /** Тултип на корневом div (не влияет на доступное имя — div без роли). */
  title?: string;
};

// Чип: квадрированная тонированная ячейка — 2 ряда (подпись сверху, значение
// снизу), ровно два children (контракт тестов Stage 3). Хук data-ui="chip" —
// стабильная точка таргета схем (`html[data-scheme=x] [data-ui=chip]`).
// Тон элемента НЕ красит текст (канон §5/guideline §3.2): --el-tint наследуется
// от внешнего className .el-* и читается только подложкой/рамкой (.element).
// Дельта — не контракт чипа (она у ElementCell), поэтому чип aria-free.
export const Chip = ({ label, value, variant = "plain", className, title }: ChipProps) => (
  <div
    className={cx(css.chip, variant === "element" && css.element, className)}
    data-ui="chip"
    title={title}
  >
    <span className={css.label}>{label}</span>
    <span className={css.value}>{value}</span>
  </div>
);
