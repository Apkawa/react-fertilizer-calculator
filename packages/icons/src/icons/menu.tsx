import React from "react";
import { type IconSvgProps, svgProps } from "../base";

/** «Бургер» — открыть меню. */
export const MenuIcon = (props: IconSvgProps) => (
  <svg aria-hidden="true" focusable="false" {...svgProps(props.size, props.color, props.style)}>
    <path
      d="M4 6h16M4 12h16M4 18h16"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
    />
  </svg>
);
