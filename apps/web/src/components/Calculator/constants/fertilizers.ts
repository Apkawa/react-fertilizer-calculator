import { parseProfileStringToNPK } from "@fertilizer/calculator/profile";
import type { FertilizerInfo } from "@fertilizer/calculator/types";

export const defaultFertilizers: FertilizerInfo[] = [
  { id: "Сульфат магния (MgSO4*7H2O)", composition: [{ formula: "MgSO4*7H2O", percent: 98 }] },
  { id: "Нитрат аммония (NH4NO3)", composition: [{ formula: "NH4NO3", percent: 98 }] },
  { id: "Нитрат калия (KNO3)", composition: [{ formula: "KNO3", percent: 98 }] },
  { id: "Сульфат калия (K2SO4)", composition: [{ formula: "K2SO4", percent: 98 }] },
  { id: "Монофосфат калия (KH2PO4)", composition: [{ formula: "KH2PO4", percent: 98 }] },
  {
    id: "Кальциевая селитра 4-в. (Ca(NO3)2*4H2O)",
    composition: [{ formula: "Ca(NO3)2*4H2O", percent: 98 }],
  },
  { id: "Сульфат аммония (NH4)2SO4)", composition: [{ formula: "(NH4)2SO4", percent: 98 }] },
  {
    id: "Магниевая селитра 6-в. (Mg(NO3)2*6Н2О)",
    composition: [{ formula: "Mg(NO3)2*6Н2О", percent: 98 }],
  },
  { id: "Хлорид кальция 6-в. (CaCl2*6H2O)", composition: [{ formula: "CaCl2*6H2O", percent: 98 }] },
  { id: "Нитрат кальция (Буйские)", npk: parseProfileStringToNPK("CaO=24 N=14.9") },
  {
    id: "Акварин Хвойный",
    npk: parseProfileStringToNPK(
      "NO3=3 P2O5=11 K2O=35 MgO=4 S=9 Fe=0.054 Zn=0.014 Cu=0.01 Mn=0.042 Mo=0.004 B=0.02",
    ),
  },
  {
    id: "Аквамикс Л",
    npk: parseProfileStringToNPK("Fe=4.1 Mn=3 Zn=0.63 Mg=0.9 Cu=0.63 Mo=0.17 Co=0.06"),
  },
  { id: "Fe 6% ЭДДГА", npk: { Fe: 6 } },
];
