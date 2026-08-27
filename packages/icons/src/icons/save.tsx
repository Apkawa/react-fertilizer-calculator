import React from "react";
import { type IconSvgProps, svgProps } from "../base";

/** «Дискета» — сохранение. */
export const SaveIcon = (props: IconSvgProps) => (
  <svg aria-hidden="true" focusable="false" {...svgProps(props.size, props.color, props.style)}>
    <path
      d="M4 4a2 2 0 0 1 2-2h9l5 5v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinejoin="round"
    />
    <path d="M8 2v5h6" fill="none" stroke="currentColor" strokeWidth={2} />
    <path d="M8 22v-7h6v7" fill="none" stroke="currentColor" strokeWidth={2} />
  </svg>
);
