import { SCHEMES, type SchemeId } from "@fertilizer/ui";
import React, { type FunctionComponent } from "react";

type SchemeSelectProps = {
  schemeId: SchemeId;
  onChange: (id: SchemeId) => void;
};

// Выбор цветовой схемы (redesign §5): native <select> (appearance-auto) —
// ортогонален теме; после Stage 8 стоит внизу сайдбара (TabMenu), рядом с
// тумблера темы. Значения options
// берём из реестра SCHEMES (единственный источник списка), поэтому
// e.target.value заведомо валидный SchemeId. Токены рамки/радиуса — из
// theme.css; высота h-10 (40px) — touch-target. Шрифт наследуется от body.
// Подложка — непрозрачный --card (как у select рецепта, §3.1): Chromium
// красит popup списка по фону select — bg-transparent давал белый popup со
// светлым текстом в тёмной теме (round 10).
export const SchemeSelect: FunctionComponent<SchemeSelectProps> = ({ schemeId, onChange }) => (
  <select
    aria-label="Цветовая схема"
    className="appearance-auto h-10 min-w-28 bg-[var(--card)] px-2 border border-(--border) border-(length:--border-width) rounded-(--radius) text-[var(--text)]"
    value={schemeId}
    onChange={(e) => onChange(e.target.value as SchemeId)}
  >
    {SCHEMES.map((scheme) => (
      <option key={scheme.id} value={scheme.id}>
        {scheme.label}
      </option>
    ))}
  </select>
);
