import {JSONFormat} from "./json";
import {ExportStateType} from "./types";
import {normalizeConcentration} from "../../../../calculator/dilution";


describe("Json", () => {
  test("export", () => {
    let f = new JSONFormat()
    f.export(EXAMPLE_STATE)
  })
  test("import", () => {
    let f = new JSONFormat()
    expect(f.import(JSON.stringify(EXAMPLE_STATE))).toEqual(EXAMPLE_STATE)

  })
})


export const EXAMPLE_STATE: ExportStateType = {
  "meta": {
    "version": "0.1.0",
    "ref": "d853706",
    "created": "2020-12-25T16:05:55.254Z"
  },
  "calculator": {
    "calculationForm": {
      "accuracy": 0.01,
      "solution_volume": 5,
      "solution_concentration": normalizeConcentration(1),
      "recipe": {
        "Cl": 0,
        "Fe": 1.5,
        "Mn": 0.6,
        "B": 0.6,
        "Zn": 0.4,
        "Cu": 0.1,
        "Mo": 0.1,
        "NO3": 214,
        "NH4": 14,
        "P": 60,
        "K": 250,
        "Ca": 170,
        "Mg": 50,
        "S": 46
      },
      "fertilizers": [{
        "id": "Микро Fe",
        "npk": {"Fe": 20.21, "S": 11.6},
        "solution_density": 1000,
        "solution_concentration": 19.799999999999997
      }],
      "dilution_enabled": false,
      "dilution_volume": 5,
      "dilution_concentration": normalizeConcentration(1),
      "ignore": {"S": true},
      "topping_up_enabled": false,
      "topping_up": {
        "newSolution": {EC: 2.0, "volume": 20},
        "currentSolution": {"volume": 15, "EC": 1.9, "profileEC": 1.9, "profileSaltsConcentration": 1.5}
      }
    },
    "result": {
      "fertilizers": [
        {
          "id": "Микро Fe",
          "weight": 0.04,
          "base_weight": 0.01,
          "volume": 2.02,
          "liquid_weight": 2.02
        }
      ],
      "elements": {
        "Fe": 1.5,
        "Mn": 0,
        "B": 0,
        "Zn": 0,
        "Cu": 0,
        "Mo": 0,
        "Co": 0,
        "Si": 0,
        "NO3": 0,
        "NH4": 0,
        "P": 0,
        "K": 0,
        "Ca": 0,
        "Mg": 0,
        "S": 1,
        "Cl": 0
      },
      "deltaElements": {
        "Fe": 0,
        "Mn": 0.6,
        "B": 0.6,
        "Zn": 0.4,
        "Cu": 0.1,
        "Mo": 0.1,
        "Co": 0,
        "Si": 0,
        "NO3": 214,
        "NH4": 14,
        "P": 60,
        "K": 250,
        "Ca": 170,
        "Mg": 50,
        "S": 45,
        "Cl": 0
      },
      "score": 1,
      "stats": {
        "count": 0,
        "time": 0.001
      }
    },
    "fertilizers": [
      {"id": "Сульфат магния (MgSO4*7H2O)", "composition": [{"formula": "MgSO4*7H2O", "percent": 98}]},
    ],
    "recipes": [
      {
        "name": "Универсальное",
        "elements": {
          "NO3": 214,
          "NH4": 14,
          "P": 60,
          "K": 250,
          "Ca": 170,
          "Mg": 50,
          "S": 46
        }
      },
      {
        "name": "Перец вегетация",
        "color": "green",
        "elements": {
          "NO3": 224,
          "NH4": 14,
          "P": 39,
          "K": 264,
          "Ca": 200,
          "Mg": 36,
          "S": 56
        }
      },
    ]
  }
}
