import React, { type HTMLAttributes } from "react";
import { cx } from "../cx";
import "./style.css";

export type CardProps = HTMLAttributes<HTMLDivElement>;

// Карточка (заменяет легасную карточку)
export const Card = ({ className, ...props }: CardProps) => (
  <div className={cx("ui-card", className)} {...props} />
);
