import React, { type InputHTMLAttributes } from "react";
import { cx } from "./cx";

export type CheckboxProps = InputHTMLAttributes<HTMLInputElement>;

// Чекбокс (нативный, без дополнительных стилей)
export const Checkbox = ({ className, ...props }: CheckboxProps) => (
  <input type="checkbox" className={cx(className)} {...props} />
);
