import React from "react";
import { type IconSvgProps, svgProps } from "../base";

/** «Стрелка вниз в поддон» — импорт. */
export const ImportIcon = (props: IconSvgProps) => (
  <svg aria-hidden="true" focusable="false" {...svgProps(props.size, props.color, props.style)}>
    <path
      d="M4 15v4a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-4"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
    />
    <path d="M12 3v11" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
    <path
      d="M8.5 10.5L12 14l3.5-3.5"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
