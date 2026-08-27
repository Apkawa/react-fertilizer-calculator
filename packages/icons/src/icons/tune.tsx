import React from "react";
import { type IconSvgProps, svgProps } from "../base";

/** «Регуляторы» — настройки рецепта. */
export const TuneIcon = (props: IconSvgProps) => (
  <svg aria-hidden="true" focusable="false" {...svgProps(props.size, props.color, props.style)}>
    <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
    <circle cx={9} cy={6} r={2.5} fill="currentColor" />
    <circle cx={15} cy={12} r={2.5} fill="currentColor" />
    <circle cx={8} cy={18} r={2.5} fill="currentColor" />
  </svg>
);
