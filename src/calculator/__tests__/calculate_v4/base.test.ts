import {calculate_v4} from "../../index";
import {elementsToNPK} from "../../fertilizer";
import {FertilizerInfo} from "../../types";
import {parseProfileStringToNPK} from "../../profile";
import {HPGFormat} from "../../format/hpg";

describe("calculate_v4", () => {
  test("Сравнение v4 расчетов с HPG ", () => {
    const result = calculate_v4({
        NO3: 200, NH4: 20, P: 40, K: 180, Ca: 200, Mg: 50, S: 73,
      },
      [
        // В HPG вносятся чистые элементы а не соли
        {
          id: "Кальций азотнокислый",
          npk: elementsToNPK({Ca: 16.972, NO3: 11.863}),
          solution_density: 1285,
          solution_concentration: 600
        },
        {id: "Калий азотнокислый", npk: elementsToNPK({K: 38.672, NO3: 13.854})},
        {id: "Нитрат аммония", npk: elementsToNPK({NO3: 17.499, NH4: 17.499})},
        {id: "Магний сернокислый", npk: elementsToNPK({Mg: 9.861, S: 13.01})},
        {id: "Калий фосфорнокислый", npk: elementsToNPK({K: 28.731, P: 22.761})},
        {id: "Калий сернокислый", npk: elementsToNPK({K: 44.874, S: 18.401})},
      ],
      {accuracy: 0.01, solution_volume: 10}
    )
    expect(result).toMatchObject({
      "deltaElements": {
        "Ca": 0, "K": 0, "Mg": 0, "NH4": 0, "NO3": 0, "P": 0, "S": 0
      },
      "elements": {
        "Ca": 200, "K": 180, "Mg": 50, "NH4": 20, "NO3": 200, "P": 40, "S": 73
      },
      "score": 100,
    })
    expect(result.fertilizers).toEqual([
      {
        "base_weight": 1.18,
        "id": "Кальций азотнокислый",
        "liquid_weight": 25.25,
        "volume": 19.65,
        "weight": 11.79
      },
      {
        "base_weight": 0.11,
        "id": "Нитрат аммония",
        "volume": null,
        "weight": 1.14
      },
      {
        "base_weight": 0.29,
        "id": "Калий азотнокислый",
        "volume": null,
        "weight": 2.9
      },
      {
        "base_weight": 0.51,
        "id": "Магний сернокислый",
        "volume": null,
        "weight": 5.07
      },
      {
        "base_weight": 0.18,
        "id": "Калий фосфорнокислый",
        "volume": null,
        "weight": 1.76
      },
      {
        "base_weight": 0.04,
        "id": "Калий сернокислый",
        "volume": null,
        "weight": 0.38
      }
    ])
  })
  test("Расчет макро и микро", () => {
    const AquaMix: FertilizerInfo = {
      id: "Аквамикс",
      npk: {Fe: 3.84, Mn: 2.57, Zn: 0.53, Cu: 0.53, Ca: 2.57, B: 0.52, Mo: 0.13},
      solution_concentration: 5.75
    }
    const result = calculate_v4({
        NO3: 200, NH4: 20, P: 40, K: 180, Ca: 200, Mg: 50, S: 73,
        Fe: 4000 / 1000,
        Mn: 636 / 1000,
        B: 714 / 1000,
        Zn: 384 / 1000,
        Cu: 69 / 1000,
        Mo: 69 / 1000,
      },
      [
        // В HPG вносятся чистые элементы а не соли
        {
          id: "Кальций азотнокислый",
          npk: elementsToNPK({Ca: 16.972, NO3: 11.863}),
          solution_density: 1285,
          solution_concentration: 600
        },
        {id: "Калий азотнокислый", npk: elementsToNPK({K: 38.672, NO3: 13.854})},
        {id: "Нитрат аммония", npk: elementsToNPK({NO3: 17.499, NH4: 17.499})},
        {id: "Магний сернокислый", npk: elementsToNPK({Mg: 9.861, S: 13.01})},
        {id: "Калий фосфорнокислый", npk: elementsToNPK({K: 28.731, P: 22.761})},
        {id: "Калий сернокислый", npk: elementsToNPK({K: 44.874, S: 18.401})},
        AquaMix,
      ],
      {accuracy: 0.01, solution_volume: 10}
    )
    expect(result).toMatchObject({
      "deltaElements": {
        "Ca": -3, "K": 0, "Mg": 0, "NH4": 0, "NO3": 0, "P": 0, "S": 0
      },
      "elements": {
        "Ca": 203, "K": 180, "Mg": 50, "NH4": 20, "NO3": 200, "P": 40, "S": 73
      },
      "score": 63.1,
    })
    expect(result.fertilizers).toEqual([
      {
        "base_weight": 1.18,
        "id": "Кальций азотнокислый",
        "liquid_weight": 25.25,
        "volume": 19.65,
        "weight": 11.79
      },
      {
        "base_weight": 0.11,
        "id": "Нитрат аммония",
        "volume": null,
        "weight": 1.14
      },
      {
        "base_weight": 0.29,
        "id": "Калий азотнокислый",
        "volume": null,
        "weight": 2.9
      },
      {
        "base_weight": 0.51,
        "id": "Магний сернокислый",
        "volume": null,
        "weight": 5.07
      },
      {
        "base_weight": 0.18,
        "id": "Калий фосфорнокислый",
        "volume": null,
        "weight": 1.76
      },
      {
        "base_weight": 0.04,
        "id": "Калий сернокислый",
        "volume": null,
        "weight": 0.38
      },
      {
        "base_weight": 0.14,
        "id": "Аквамикс",
        "volume": 238.26,
        "weight": 1.37
      }
    ])
  })


  test("Обработка случая с нулем в профиле", () => {
    const AquaMix: FertilizerInfo = {
      id: "Аквамикс Л",
      npk: parseProfileStringToNPK("Mg=0.9 Fe=4.1 Mn=3 B=0.5 Zn=0.63 Cu=0.63 Mo=0.17 Co=0.06"),
    }
    const result = calculate_v4(
      HPGFormat.parseProfileString("Mg=52.82 " +
        "Fe=4.2 Mn=0.282 B=0.62 Zn=0.58 Cu=0.58 Mo=0.143 Co=0 Si=0"),
      [
        AquaMix,
      ],
      {accuracy: 0.01, solution_volume: 10}
    )
    expect(result).toMatchObject({
      "deltaElements": {
        "B": 0,
        "Ca": 0,
        "Cl": 0,
        "Co": -0.0744,
        "Cu": -0.20120000000000005,
        "Fe": -0.8839999999999995,
        "K": 0,
        "Mg": 51.82,
        "Mn": -3.438,
        "Mo": -0.0678,
        "NH4": 0,
        "NO3": 0,
        "P": 0,
        "S": 0,
        "Si": 0,
        "Zn": -0.20120000000000005,
      },
      "elements": {
        // Комплекс по бору
        "B": 0.62,
        "Ca": 0,
        "Cl": 0,
        "Co": 0.0744,
        "Cu": 0.7812,
        "Fe": 5.084,
        "K": 0,
        "Mg": 1,
        "Mn": 3.72,
        "Mo": 0.2108,
        "NH4": 0,
        "NO3": 0,
        "P": 0,
        "S": 0,
        "Si": 0,
        "Zn": 0.7812,
      },
      "score": 30.7,
    })
  })

})
