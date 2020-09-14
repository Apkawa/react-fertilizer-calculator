import {Recipe} from "@/components/Calculator/types";

export const DEFAULT_RECIPES: Recipe[] = [
  {
    name: "Универсальное",
    elements: {NO3: 200, NH4: 0, P: 60, K: 250, Ca: 170, Mg: 50,}
  },
  {
    name: "Перец вегетация",
    color: 'green',
    elements: {NO3: 220, NH4: 0, P: 50, K: 200, Ca: 170, Mg: 50,}
  },
  {
    name: "Перец цветение",
    color: 'yellow',
    elements: {NO3: 150, NH4: 0, P: 90, K: 280, Ca: 170, Mg: 50,}
  },
  {
    name: "Перец плодоношение",
    color: 'red',
    elements: {NO3: 140, NH4: 0, P: 50, K: 330, Ca: 170, Mg: 50,}
  },
  {
    name: "Томат вегетация",
    color: 'green',
    elements: {NO3: 220, NH4: 0, P: 50, K: 260, Ca: 220, Mg: 60,}
  },
  {
    name: "Томат цветение",
    color: 'yellow',
    elements: {NO3: 220, NH4: 0, P: 50, K: 280, Ca: 200, Mg: 60}
  },
  {
    name: "Томат плодоношение",
    color: 'red',
    elements: {NO3: 200, NH4: 0, P: 50, K: 320, Ca: 180, Mg: 60}
  },
  {
    name: "Огурцы",
    elements: {NO3: 180, NH4: 0, P: 80, K: 320, Ca: 180, Mg: 50}
  },
  {
    name: "Салат",
    elements: {NO3: 200, NH4: 0, P: 80, K: 200, Ca: 170, Mg: 50}
  },
  {
    name: "Бобовые",
    elements: {NO3: 80, NH4: 0, P: 110, K: 400, Ca: 170, Mg: 50}
  },
  {
    name: "Капуста",
    elements: {NO3: 200, NH4: 0, P: 70, K: 200, Ca: 170, Mg: 50}
  },
  {
    name: "Клубника",
    elements: {NO3: 150, NH4: 0, P: 70, K: 350, Ca: 200, Mg: 50}
  },
  {
    name: "Картофель",
    elements: {NO3: 200, NH4: 0, P: 80, K: 200, Ca: 170, Mg: 50}
  },
  {
    name: "Тыква",
    elements: {NO3: 100, NH4: 0, P: 95, K: 320, Ca: 170, Mg: 50}
  },
]
