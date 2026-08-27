import React from "react";
import { type IconSvgProps, svgProps } from "../base";

/** «Карандаш» — редактирование записи. */
export const EditIcon = (props: IconSvgProps) => (
  <svg aria-hidden="true" focusable="false" {...svgProps(props.size, props.color, props.style)}>
    <path
      d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinejoin="round"
    />
  </svg>
);
