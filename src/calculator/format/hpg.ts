import {BaseFormat} from "./base";
import {ExportStateType} from "./types";
import {NPKElements} from "../types";
import {FERTILIZER_ELEMENT_NAMES, MICRO_ELEMENT_NAMES} from '../constants';
import {buildNPKFertilizer, elementsToNPK, normalizeFertilizer} from "../fertilizer";
import {entries, tryParseFloat} from "../../utils";
import {FertilizerInfo} from "../../components/Calculator/types";
import {normalizeConcentration} from "../dilution";

const FERTILIZERS = [
  "CaNO3", "KNO3", "NH4NO3", "MgSO4", "KH2PO4", "K2SO4", "MgNO3", "CaCl2",
]

export class HPGFormat extends BaseFormat {
  static ext = ".hpg"

  export(state: ExportStateType): string {
    return "";
  }

  buildFertilizers(parsed: any): FertilizerInfo[] {
    let fertilizers = []
    for (let f of FERTILIZERS) {
      let els = entries(normalizeFertilizer(
        {id: "", composition: [{formula: f, percent: 100}]}, true
      ).elements).filter(e => e[1]).map(e => e[0])

      let npk = elementsToNPK(Object.fromEntries(els.map(e => [e, parsed[`${f}_${e}`] || 0])))
      const fInfo: FertilizerInfo = {
        id: f,
        npk,
        solution_density: parsed[`gml${f}`] * 1000,
        solution_concentration: parsed[`gl${f}`],
      }
      let pump_number = parseFloat(parsed[`m${f}`].match(/\d+/)) || undefined
      if (pump_number) {
        fInfo.pump_number = pump_number
      }
      fertilizers.push(fInfo)
    }
    // Micro
    let microNPK = Object.fromEntries(MICRO_ELEMENT_NAMES.map(e => [e, parsed[`d${e}`]]))
    if (parsed.chkComplex === "TRUE") {
      const fInfo: FertilizerInfo = buildNPKFertilizer('Микро', microNPK)
      fInfo.solution_density = parsed['gmlCmplx']
      fInfo.solution_concentration = parsed['glCmplx']
      let pump_number = parseFloat(parsed[`mCmplx`].match(/\d+/))
      if (pump_number) {
        fInfo.pump_number = pump_number
      }
      fertilizers.push(fInfo)
    } else {
      for (let e of MICRO_ELEMENT_NAMES) {
        if (!microNPK[e]) {
          continue
        }
        const fInfo: FertilizerInfo = buildNPKFertilizer(e, {[e]: microNPK[e] || 0})
        fInfo.solution_density = parsed[`gl${e}`]
        fInfo.solution_concentration = parsed[`gl${e}`]
        let pump_number = parseFloat(parsed[`m${e}`].match(/\d+/)) || undefined
        if (pump_number) {
          fInfo.pump_number = pump_number
        }
        fertilizers.push(fInfo)
      }
    }
    return fertilizers
  }

  import(string: string): ExportStateType {
    let pairs = string.split('\n').map(l => l.split('=')).map(([k, v]) => [k, tryParseFloat(v)])
    let parsed = Object.fromEntries(pairs)
    const solution_volume = parseFloat(parsed.V || 1)
    const fertilizers = this.buildFertilizers(parsed)
    let npk = Object.fromEntries(
      pairs.filter(e => FERTILIZER_ELEMENT_NAMES.includes(e[0] as FERTILIZER_ELEMENT_NAMES))
    ) as NPKElements
    for (let e of MICRO_ELEMENT_NAMES) {
      let v = npk[e]
      if (v) {
        npk[e] = v / 1000
      }
    }
    let state: ExportStateType = {
      meta: {
        version: parsed.version || "",
        created: "",
        ref: "",
      },
      calculator: {
        calculationForm: {
          recipe: npk,
          solution_volume: parsed.tAml / 1000,
          solution_concentration: normalizeConcentration((solution_volume * 1000) / parsed.tAml),
          dilution_enabled: true,
          dilution_volume: solution_volume,
          dilution_concentration: normalizeConcentration(1),
          accuracy: 0.01,
          fertilizers: fertilizers.filter(f => {
            if (f.id === 'K2SO4') {
              return parsed.chK2SO4 === 'TRUE'
            }
            if (f.id === 'MgNO3') {
              return parsed.chMgNO3 === 'TRUE'
            }
            return true
          }),
          mixerOptions: {
            url: parsed.addrMixer
          },
        },
        result: null,
        fertilizers,
        recipes: [],
      }
    }

    return state;
  }

  static parseProfileStringToObject(profile: string): { [key: string]: number } {
    const elements: { [key: string]: number } = {}

    for (let e of profile.split(' ')) {
      e = e.trim()
      if (e) {
        let pair = e.split('=')
        if (pair.length === 2) {
          elements[pair[0].trim()] = parseFloat(pair[1].replace(",", '.'))
        }
      }
    }
    return elements
  }

  /**
   * Заполняем 0 пропущенные значения
   * @param npk
   */
  static fillNPKElements(npk: NPKElements): NPKElements {
    const newNpk = {...npk}
    for (let n of FERTILIZER_ELEMENT_NAMES) {
      newNpk[n] = newNpk[n] || 0
    }
    return newNpk
  }

  static parseProfileString(profile: string): NPKElements {
    const elements: NPKElements = {}

    const p = HPGFormat.parseProfileStringToObject(profile)
    for (const [k, v] of Object.entries(p)) {
      if (FERTILIZER_ELEMENT_NAMES.includes(k as FERTILIZER_ELEMENT_NAMES)) {
        elements[k as FERTILIZER_ELEMENT_NAMES] = v
      }
    }
    if (p['N'] && !elements.NO3) {
      elements.NO3 = p['N']
    }
    return elements
  }

  static stringifyProfile(npk: NPKElements): string {
    let s = FERTILIZER_ELEMENT_NAMES.map(
      e => typeof npk[e] != "undefined" && `${e}=${npk[e]}`)
      .filter(e => e).join(' ')
    return `N=${(npk.NO3 || 0) + (npk.NH4 || 0)} ${s}`
  }
}
