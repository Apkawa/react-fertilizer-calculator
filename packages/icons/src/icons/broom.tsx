import React from "react";
import { type IconSvgProps, svgProps } from "../base";

/** «Метла» — полная очистка (сброс рецепта). */
export const BroomIcon = (props: IconSvgProps) => (
  <svg aria-hidden="true" focusable="false" {...svgProps(props.size, props.color, props.style)}>
    <path d="M17 3v10" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" />
    <path
      d="M13.5 13h7l-.9 6.5a1 1 0 0 1-1 1h-3.2a1 1 0 0 1-1-1z"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinejoin="round"
    />
    <path d="M16 14v4.5M18.5 14v4.5" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
  </svg>
);
