import {FertilizerComposition, FertilizerInfo, NPKElements} from "@/calculator/types";


export interface AddEditFormType extends FertilizerInfo {
  composition_enable?: boolean,
  solution_density_enable?: boolean,
}
