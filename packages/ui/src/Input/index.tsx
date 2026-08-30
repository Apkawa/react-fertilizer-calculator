import React, { type InputHTMLAttributes } from "react";
import { cx } from "../cx";
import "./style.css";

export type InputProps = InputHTMLAttributes<HTMLInputElement>;

// Представительский инпут (заменяет легасный инпут формы)
export const Input = ({ className, ...props }: InputProps) => (
  <input className={cx("ui-input", className)} {...props} />
);
