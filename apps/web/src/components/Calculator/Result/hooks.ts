import type { FertilizerWeights } from "@fertilizer/calculator";
import { groupFertilizerBySolution } from "@fertilizer/calculator/dilution";
import { calculatePPM } from "@fertilizer/calculator/helpers";
import { useStore } from "@/store";
import { entries, toMap } from "@/utils";

export function usePPM() {
  const result = useStore((s) => s.calculator.result);
  // Объем раствора из формы (null-safe: дефолт расчёта PPM совпадает с дефолтом функции)
  const solution_volume = useStore((s) => s.calculator.calculationForm?.solution_volume);
  const fertilizerWeights = (result?.fertilizers || []).map((f) => ({ ...f }));
  const ppm = calculatePPM(fertilizerWeights, solution_volume ?? 1);
  return ppm;
}

export function useFertilizerSolutionGroup() {
  const { fertilizers, result } = useStore((s) => s.calculator);

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
