import React from "react";
import { type IconSvgProps, svgProps } from "../base";

/** «Метла» — полная очистка (сброс рецепта). */
export const BroomIcon = (props: IconSvgProps) => (
  <svg aria-hidden="true" focusable="false" {...svgProps(props.size, props.color, props.style)}>
    <path d="M12 3v9" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" />
    <path
      d="M9.5 12h5l2 8a1 1 0 0 1-1 1h-7a1 1 0 0 1-1-1z"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinejoin="round"
    />
    <path
      d="M10.5 14v4.5M13.5 14v4.5"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
    />
  </svg>
);
