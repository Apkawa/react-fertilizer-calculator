import React, { type InputHTMLAttributes } from "react";
import { cx } from "./cx";

export type RadioProps = InputHTMLAttributes<HTMLInputElement>;

// Радио-кнопка (нативная, без дополнительных стилей)
export const Radio = ({ className, ...props }: RadioProps) => (
  <input type="radio" className={cx(className)} {...props} />
);
