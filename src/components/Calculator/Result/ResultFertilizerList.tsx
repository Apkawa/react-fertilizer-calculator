import React from "react";
import { useSelector } from "react-redux";
import { getFormValues } from "redux-form";
import type { FertilizerWeights } from "@/calculator";
import { REDUX_FORM_NAME } from "@/components/Calculator/constants";
import type { CalculatorFormValues } from "@/components/Calculator/types";
import { countDecimals, round } from "@/utils";

interface ResultFertilizerListProps {
  fertilizers: FertilizerWeights[];
}

export function ResultFertilizerList(props: ResultFertilizerListProps) {
  const { fertilizers } = props;
  const { accuracy } = useSelector(getFormValues(REDUX_FORM_NAME)) as CalculatorFormValues;
  return (
    <>
      {fertilizers.map((f) => {
        return (
          <li key={f.id}>
            {round(f.weight, countDecimals(accuracy))}г &nbsp;
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
