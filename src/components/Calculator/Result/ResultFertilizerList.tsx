import React from "react";
import {countDecimals, round} from "@/utils";
import {useSelector} from "react-redux";
import {getFormValues} from "redux-form";
import {REDUX_FORM_NAME} from "@/components/Calculator/constants";
import {CalculatorFormValues} from "@/components/Calculator/types";
import {FertilizerWeights} from "@/calculator";

interface ResultFertilizerListProps {
    fertilizers: FertilizerWeights[],
}

export function ResultFertilizerList(props: ResultFertilizerListProps) {
    const {fertilizers} = props
    const {
      accuracy
    } = useSelector(getFormValues(REDUX_FORM_NAME)) as CalculatorFormValues
    return (
        <>
            {fertilizers.map(f => {
                return (
                  <li key={f.id}>
                      {round(f.weight, countDecimals(accuracy))}г
                      &nbsp;
                      {f.volume && `(${f.volume} мл)`}
                      &nbsp;
                      {f.id}
                  </li>
                )
            })}
        </>
    )
}
