import React from "react";
import { type IconSvgProps, svgProps } from "../base";

/** «Стрелка вверх из поддона» — экспорт. */
export const ExportIcon = (props: IconSvgProps) => (
  <svg aria-hidden="true" focusable="false" {...svgProps(props.size, props.color, props.style)}>
    <path
      d="M4 15v4a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-4"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
    />
    <path d="M12 15V4" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
    <path
      d="M8.5 7.5L12 4l3.5 3.5"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
