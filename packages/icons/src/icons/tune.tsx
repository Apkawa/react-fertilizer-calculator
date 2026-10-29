import React from "react";
import { type IconSvgProps, svgProps } from "../base";

/** «Регуляторы» — настройки рецепта. Глиф из вёрстки-канона (apps/web-design/index.html). */
export const TuneIcon = (props: IconSvgProps) => (
  <svg aria-hidden="true" focusable="false" {...svgProps(props.size, props.color, props.style)}>
    <path
      d="M4 6h4M12 6h8M4 12h8M16 12h4M4 18h3M11 18h9"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
    />
    <circle cx={10} cy={6} r={2} fill="none" stroke="currentColor" strokeWidth={2} />
    <circle cx={14} cy={12} r={2} fill="none" stroke="currentColor" strokeWidth={2} />
    <circle cx={9} cy={18} r={2} fill="none" stroke="currentColor" strokeWidth={2} />
  </svg>
);
