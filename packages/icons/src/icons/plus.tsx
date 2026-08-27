import React from "react";
import { type IconSvgProps, svgProps } from "../base";

/** «Плюс» — добавление (удобрение, рецепт, строка). */
export const PlusIcon = (props: IconSvgProps) => (
  <svg aria-hidden="true" focusable="false" {...svgProps(props.size, props.color, props.style)}>
    <path d="M9 3h6v6h6v6h-6v6H9v-6H3V9h6V3z" fill="currentColor" />
  </svg>
);
