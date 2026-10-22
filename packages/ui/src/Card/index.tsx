import React, { type HTMLAttributes } from "react";
import { cx } from "../cx";
import css from "./style.module.css";

export type CardProps = HTMLAttributes<HTMLDivElement>;

// Карточка (заменяет легасную карточку)
export const Card = ({ className, ...props }: CardProps) => (
  <div className={cx(css.card, className)} {...props} />
);
