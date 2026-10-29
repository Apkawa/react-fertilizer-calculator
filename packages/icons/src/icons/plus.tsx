import React from "react";
import { type IconSvgProps, svgProps } from "../base";

/** «Плюс» — добавление (удобрение, рецепт, строка).
 * stroke-стиль из макета apps/web-design (index.html §3.1, stroke-width 2,
 * linecap round) — толщина линий совпадает с остальными иконками. */
export const PlusIcon = (props: IconSvgProps) => (
  <svg aria-hidden="true" focusable="false" {...svgProps(props.size, props.color, props.style)}>
    <path
      d="M12 5v14M5 12h14"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
    />
  </svg>
);
