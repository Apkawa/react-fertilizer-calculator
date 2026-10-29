import React from "react";
import { type IconSvgProps, svgProps } from "../base";

/**
 * «Монитор» — режим темы «Система» (redesign §5): круг со stroke,
 * левая половина залита (glyph из макета apps/web-design/index.html).
 */
export const MonitorIcon = (props: IconSvgProps) => (
  <svg aria-hidden="true" focusable="false" {...svgProps(props.size, props.color, props.style)}>
    <circle cx={12} cy={12} r={8} fill="none" stroke="currentColor" strokeWidth={2} />
    <path d="M12 4A8 8 0 0 0 12 20Z" fill="currentColor" />
  </svg>
);
