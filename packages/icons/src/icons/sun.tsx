import React from "react";
import { type IconSvgProps, svgProps } from "../base";

/** «Солнце» — светлый режим. */
export const SunIcon = (props: IconSvgProps) => (
  <svg aria-hidden="true" focusable="false" {...svgProps(props.size, props.color, props.style)}>
    <circle cx={12} cy={12} r={4.5} fill="currentColor" />
    <path
      d="M12 2v2.5M12 19.5v2.5M2 12h2.5M19.5 12h2.5M18 6l-1.5 1.5M6 6l1.5 1.5M18 18l-1.5-1.5M6 18l1.5-1.5"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
    />
  </svg>
);
