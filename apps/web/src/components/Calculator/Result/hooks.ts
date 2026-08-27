import { useSelector } from "react-redux";
import { getFormValues } from "redux-form";
import type { FertilizerWeights } from "@/calculator";
import { groupFertilizerBySolution } from "@/calculator/dilution";
import { calculatePPM } from "@/calculator/helpers";
import { REDUX_FORM_NAME } from "@/components/Calculator/constants";
import type { CalculatorFormValues, CalculatorState } from "@/components/Calculator/types";
import { entries, toMap } from "@/utils";

export function usePPM() {
  const { result } = useSelector<any>((state) => state.calculator) as CalculatorState;
  const { solution_volume } = useSelector(getFormValues(REDUX_FORM_NAME)) as CalculatorFormValues;
  const fertilizerWeights = (result?.fertilizers || []).map((f) => ({ ...f }));
  const ppm = calculatePPM(fertilizerWeights, solution_volume);
  return ppm;
}

export function useFertilizerSolutionGroup() {
  const { fertilizers, result } = useSelector<any>((state) => state.calculator) as CalculatorState;

  const fertilizersWeights = (result?.fertilizers || []).map((f) => ({ ...f }));

  const fertilizerWeightsMap = toMap(fertilizersWeights, "id");

  const pairs = entries(groupFertilizerBySolution(fertilizers)).sort(([a], [b]) =>
    a > b ? 1 : -1,
  );
  const fertilizerWeightGroups: [(typeof pairs)[0][0], FertilizerWeights[]][] = pairs.map(
    ([g, fList]) => {
      const ws = fList.map((f) => fertilizerWeightsMap[f.id]).filter((f) => f);
      return [g, ws];
    },
  );

  return fertilizerWeightGroups;
}
