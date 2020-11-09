import {Recipe} from "@/components/Calculator/types";
import {NeedElements} from "@/calculator/types";

export const DEFAULT_MICRO_RECIPE: NeedElements = {
  Fe: 4500 / 1000,
  Mn: 636 / 1000,
  B: 636 / 1000,
  Zn: 384 / 1000,
  Cu: 69 / 1000,
  Mo: 69 / 1000,
}

export const DEFAULT_RECIPES: Recipe[] = [
  {
    name: "Универсальное",
    elements: {NO3: 214, NH4: 14, P: 60, K: 250, Ca: 170, Mg: 50, S: 46}
  },
  {
    name: "Перец вегетация",
    color: 'green',
    elements: {NO3: 224, NH4: 14, P: 39, K: 264, Ca: 200, Mg: 36, S: 56}
  },
  {
    name: "Перец цветение",
    color: 'yellow',
    elements: {NO3: 150, NH4: 0, P: 90, K: 280, Ca: 170, Mg: 50, S: 56}
  },
  {
    name: "Перец плодоношение",
    color: 'red',
    elements: {NO3: 140, NH4: 0, P: 50, K: 330, Ca: 170, Mg: 50, S: 56}
  },
  {
    name: "Томат вегетация",
    color: 'green',
    elements: {NO3: 220, NH4: 0, P: 50, K: 260, Ca: 220, Mg: 60, S: 141}
  },
  {
    name: "Томат цветение",
    color: 'yellow',
    elements: {NO3: 220, NH4: 0, P: 50, K: 280, Ca: 200, Mg: 60, S: 141}
  },
  {
    name: "Томат плодоношение",
    color: 'red',
    elements: {NO3: 200, NH4: 0, P: 50, K: 320, Ca: 180, Mg: 60, S: 141}
  },
  {
    name: "Огурцы",
    elements: {NO3: 180, NH4: 0, P: 80, K: 320, Ca: 180, Mg: 50, S: 44}
  },
  {
    name: "Салат",
    elements: {NO3: 200, NH4: 0, P: 80, K: 200, Ca: 170, Mg: 50, S: 0}
  },
  {
    name: "Бобовые",
    elements: {NO3: 80, NH4: 0, P: 110, K: 400, Ca: 170, Mg: 50, S: 0}
  },
  {
    name: "Капуста",
    elements: {NO3: 200, NH4: 0, P: 70, K: 200, Ca: 170, Mg: 50, S: 0}
  },
  {
    name: "Клубника",
    elements: {NO3: 150, NH4: 0, P: 70, K: 350, Ca: 200, Mg: 50, S: 48}
  },
  {
    name: "Картофель",
    elements: {NO3: 200, NH4: 0, P: 80, K: 200, Ca: 170, Mg: 50, S: 0}
  },
  {
    name: "Тыква",
    elements: {NO3: 100, NH4: 0, P: 95, K: 320, Ca: 170, Mg: 50, S: 0}
  },
]
