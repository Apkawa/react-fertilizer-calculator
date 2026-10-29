import React from "react";
import { type IconSvgProps, svgProps } from "../base";

/**
 * «Грип» — 6 залитых точек (2 колонки × 3), без stroke: drag-handle
 * ряда удобрений (glyph из макета apps/web-design/index.html, .fert-grip).
 */
export const GripIcon = (props: IconSvgProps) => (
  <svg aria-hidden="true" focusable="false" {...svgProps(props.size, props.color, props.style)}>
    <g fill="currentColor">
      <circle cx={9} cy={6} r={1.6} />
      <circle cx={15} cy={6} r={1.6} />
      <circle cx={9} cy={12} r={1.6} />
      <circle cx={15} cy={12} r={1.6} />
      <circle cx={9} cy={18} r={1.6} />
      <circle cx={15} cy={18} r={1.6} />
    </g>
  </svg>
);
