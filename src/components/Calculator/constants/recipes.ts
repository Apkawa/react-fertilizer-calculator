import {Recipe} from "@/components/Calculator/types";

export const DEFAULT_RECIPES: Recipe[] = [
  {
    name: "Универсальное",
    elements: {N: 200, P: 60, K: 250, Ca: 170, Mg: 50,}
  },
  {
    name: "Перец вегетация",
    color: 'green',
    elements: {N: 220, P: 50, K: 200, Ca: 170, Mg: 50,}
  },
  {
    name: "Перец цветение",
    color: 'yellow',
    elements: {N: 150, P: 90, K: 280, Ca: 170, Mg: 50,}
  },
  {
    name: "Перец плодоношение",
    color: 'red',
    elements: {N: 140, P: 50, K: 330, Ca: 170, Mg: 50,}
  },
  {
    name: "Томат вегетация",
    color: 'green',
    elements: {N: 220, P: 50, K: 260, Ca: 220, Mg: 60,}
  },
  {
    name: "Томат цветение",
    color: 'yellow',
    elements: {N: 220, P: 50, K: 280, Ca: 200, Mg: 60}
  },
  {
    name: "Томат плодоношение",
    color: 'red',
    elements: {N: 200, P: 50, K: 320, Ca: 180, Mg: 60}
  },
  {
    name: "Огурцы",
    elements: {N: 180, P: 80, K: 320, Ca: 180, Mg: 50}
  },
  {
    name: "Салат",
    elements: {N: 200, P: 80, K: 200, Ca: 170, Mg: 50}
  },
  {
    name: "Бобовые",
    elements: {N: 80, P: 110, K: 400, Ca: 170, Mg: 50}
  },
  {
    name: "Капуста",
    elements: {N: 200, P: 70, K: 200, Ca: 170, Mg: 50}
  },
  {
    name: "Клубника",
    elements: {N: 150, P: 70, K: 350, Ca: 200, Mg: 50}
  },
  {
    name: "Картофель",
    elements: {N: 200, P: 80, K: 200, Ca: 170, Mg: 50}
  },
  {
    name: "Тыква",
    elements: {N: 100, P: 95, K: 320, Ca: 170, Mg: 50}
  },
]
