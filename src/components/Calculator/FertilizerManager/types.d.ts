import {FertilizerComposition, NPKElements} from "@/calculator/types";


export interface AddEditFormType {
  id: string,
  npk?: NPKElements,
  composition_enable?: boolean,
  composition?: FertilizerComposition[],
  solution_density_enable?: boolean,
  solution_density?: number,
}
