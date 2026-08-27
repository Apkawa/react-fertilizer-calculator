import React from "react";
import { type IconSvgProps, svgProps } from "../base";

/** «Корзина» — удаление записи. */
export const TrashIcon = (props: IconSvgProps) => (
  <svg aria-hidden="true" focusable="false" {...svgProps(props.size, props.color, props.style)}>
    <path d="M4 6h16" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
    <path
      d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
    />
    <path
      d="M6 6l1 14a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1l1-14"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
    />
    <path d="M10 11v6M14 11v6" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
  </svg>
);
