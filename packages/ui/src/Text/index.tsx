import React, { type HTMLAttributes, type ReactNode } from "react";
import { cx } from "../cx";
import css from "./style.module.css";

export type TextProps = HTMLAttributes<HTMLDivElement>;

// Текстовый блок (заменяет легасный текстовый блок). Хук data-ui="text" —
// стабильная точка таргета схем (`html[data-scheme=x] [data-ui=text]`);
// ставится после spread, чтобы не перебивался внешними props.
export const Text = ({ className, ...props }: TextProps) => (
  <div className={cx(css.text, className)} {...props} data-ui="text" />
);

export type HeadingTag = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

export interface HeadingProps {
  as?: HeadingTag;
  className?: string;
  children?: ReactNode;
}

// Заголовок (заменяет легасный заголовок; по умолчанию h2 — это заголовок
// карточки канона: 1.125rem/600). Иерархия размеров — класс по тегу
// (css.h1..css.h6 в @layer components); хук data-ui не нужен: схема
// таргетит заголовок через Card/Text, а не по тегу. className потребителя
// идёт последним и перебивает размер (tailwind utilities вне @layer).
export const Heading = ({ as = "h2", className, ...props }: HeadingProps) => {
  const Tag = as;
  return <Tag className={cx(css.heading, css[as], className)} {...props} />;
};
