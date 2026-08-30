import React, { type HTMLAttributes } from "react";
import { cx } from "../cx";
import "./style.css";

export type LabelProps = HTMLAttributes<HTMLLabelElement>;

// Подпись поля формы; контрол передаётся внутрь (children) — паттерн «label оборачивает input»
export const Label = ({ className, ...props }: LabelProps) => {
  // biome-ignore lint/a11y/noLabelWithoutControl: контрол передаётся как children (см. Form/Checkbox)
  return <label className={cx("ui-label", className)} {...props} />;
};
