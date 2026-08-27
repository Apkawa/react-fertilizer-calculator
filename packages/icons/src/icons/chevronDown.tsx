import React from "react";
import { type IconSvgProps, svgProps } from "../base";

/** «Уголок вниз» — раскрыть выпадающий список. */
export const ChevronDownIcon = (props: IconSvgProps) => (
  <svg aria-hidden="true" focusable="false" {...svgProps(props.size, props.color, props.style)}>
    <path
      d="M5 9l7 7 7-7"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
