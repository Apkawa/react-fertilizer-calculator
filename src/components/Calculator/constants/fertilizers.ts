import {buildNPKFertilizer} from "@/calculator/fertilizer";
import {FertilizerInfo} from "@/calculator/types";

// Бутылка-1 Макра-азотная
// Селитра амиачная
// Селитра калиевая
// Селитра кальциевая
//
// Бутылка 2 Макра-серно-фосфорная
// Сульфат аммония
// Сульфат магния семиводный
// Монофосфат калия

export const defaultFertilizers: FertilizerInfo[] = [
  // buildNPKFertilizer(
  //   "Valagro 3:11:38",
  //   {
  //     NO3: 3, P: 11, K: 38, Ca: 0, Mg: 4,
  //   }),
  // buildNPKFertilizer("Кальциевая селитра",
  //   {
  //     NO3: 16, Ca: 24,
  //   }),
  // buildNPKFertilizer("Сульфат магния", {Mg: 16.7, S: 13.3}),
  // buildNPKFertilizer("Сульфат калия", {K: 50, S: 18}),
  // buildNPKFertilizer("Нитрат калия", {NO3: 14, K: 46}),
  // buildNPKFertilizer("Монофосфат калия", {P: 50, K: 33}),
  // {id: "Сульфат калия", composition: [{formula: "K2SO4", percent: 98}]},
  {id: "Сульфат магния (MgSO4*7H2O)", composition: [{formula: "MgSO4*7H2O", percent: 98}]},
  {id: "Нитрат аммония (NH4NO3)", composition: [{formula: "NH4NO3", percent: 98}]},
  {id: "Нитрат калия (KNO3)", composition: [{formula: "KNO3", percent: 98}]},
  {id: "Сульфат калия (K2SO4)", composition: [{formula: "K2SO4", percent: 98}]},
  {id: "Монофосфат калия (KH2PO4)", composition: [{formula: "KH2PO4", percent: 98}]},
  {id: "Кальциевая селитра (Ca(NO3)2*4H2O)", composition: [{formula: "Ca(NO3)2*4H2O", percent: 98}]},
  {id: "Сульфат аммония (NH4)2SO4)", composition: [{formula: "(NH4)2SO4", percent: 98}]},
  // {id: "Магниевая селитра (Mg(NO3)2*6Н2О)", composition: [{formula: "Mg(NO3)2*6Н2О", percent: 98}]},
   buildNPKFertilizer("Магниевая селитра (Mg(NO3)2*6Н2О)", {NO3: 7, Mg: 10}),

]
