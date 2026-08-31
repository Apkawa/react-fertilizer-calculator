import React, { type HTMLAttributes, type ReactNode } from "react";
import { cx } from "../cx";
import "./style.css";

export type TextProps = HTMLAttributes<HTMLDivElement>;

// Текстовый блок (заменяет легасный текстовый блок; типографика наследуется от body)
export const Text = (props: TextProps) => <div {...props} />;

export type HeadingTag = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

export interface HeadingProps {
  as?: HeadingTag;
  className?: string;
  children?: ReactNode;
}

// Заголовок (заменяет легасный заголовок; по умолчанию h2)
export const Heading = ({ as = "h2", className, ...props }: HeadingProps) => {
  const Tag = as;
  return <Tag className={cx("ui-heading", className)} {...props} />;
};
