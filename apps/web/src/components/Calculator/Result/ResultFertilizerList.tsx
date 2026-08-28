import type { FertilizerWeights } from "@fertilizer/calculator";
import React from "react";
import { useStore } from "@/store";
import { countDecimals, round } from "@/utils";

interface ResultFertilizerListProps {
  fertilizers: FertilizerWeights[];
}

export function ResultFertilizerList(props: ResultFertilizerListProps) {
  const { fertilizers } = props;
  // Точность из формы (null-safe; дефолт формы — 0.2)
  const accuracy = useStore((s) => s.calculator.calculationForm?.accuracy);
  return (
    <>
      {fertilizers.map((f) => {
        return (
          <li key={f.id}>
            {round(f.weight, countDecimals(accuracy ?? 0.2))}г &nbsp;
            <span title="Объем или вес раствора">
              {f.volume && `(${f.volume} мл${f.liquid_weight ? `, ${f.liquid_weight}г` : ""})`}
            </span>
            &nbsp;
            {f.id}
          </li>
        );
      })}
    </>
  );
}
