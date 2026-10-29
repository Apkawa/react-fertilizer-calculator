import { FERTILIZER_ELEMENT_NAMES } from "@fertilizer/calculator/constants";
import type { Elements } from "@fertilizer/calculator/types";
import { Chip } from "@fertilizer/ui";
import React, { type FunctionComponent } from "react";
import { elementDisplayName, elementTintClass } from "./fertilizerRow";

interface FertilizerCompositionProps {
  elements: Elements;
}

// Состав удобрения — канон §3.2: чипы @fertilizer/ui Chip(variant=element) в
// ряду flex flex-wrap gap-1 (до 11 чипов, перенос разрешён). Класс fert-chips —
// CSS-хук ряда merged-карточки (fertilizerRow.css: вторая строка на всю
// ширину). Подпись — оксидное имя (P2O5/K2O/CaO/MgO), значение без «%», тон —
// класс .el-* (декоративен: подложка/рамка, текст не красится). Рендерится из
// данных состава (store).
export const FertilizerComposition: FunctionComponent<FertilizerCompositionProps> = (props) => {
  const { elements } = props;
  return (
    <div className="fert-chips flex flex-wrap gap-1">
      {FERTILIZER_ELEMENT_NAMES.map((name) => {
        const value = elements[name];
        if (!value) {
          return null;
        }
        return (
          <Chip
            key={name}
            variant="element"
            label={elementDisplayName(name)}
            value={value}
            className={elementTintClass(name)}
          />
        );
      })}
    </div>
  );
};
