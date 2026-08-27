import React from "react";
import { type IconSvgProps, svgProps } from "../base";

/** «Кольцо со стрелкой» — сброс к началу. */
export const RestartIcon = (props: IconSvgProps) => (
  <svg aria-hidden="true" focusable="false" {...svgProps(props.size, props.color, props.style)}>
    <path
      d="M12 4a8 8 0 0 1 8 8 8 8 0 0 1-8 8 8 8 0 0 1-8-8"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
    />
    <path d="M12 4l-2.5-2.2v4.4z" fill="currentColor" />
  </svg>
);
