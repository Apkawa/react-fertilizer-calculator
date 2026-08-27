import React from "react";
import { type IconSvgProps, svgProps } from "../base";

/** «Корзина» — удаление записи. */
export const TrashIcon = (props: IconSvgProps) => (
  <svg aria-hidden="true" focusable="false" {...svgProps(props.size, props.color, props.style)}>
    <path d="M4 7h16" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
    <path
      d="M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
    />
    <path
      d="M6 7l1 13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1l1-13"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
    />
    <path d="M10 11v8M14 11v8" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
  </svg>
);
