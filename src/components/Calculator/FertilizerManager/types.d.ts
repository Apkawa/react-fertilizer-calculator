import {FertilizerInfo} from "@/components/Calculator/types";


export interface AddEditFormType extends FertilizerInfo {
  composition_enable?: boolean,
  solution_density_enable?: boolean,
}
