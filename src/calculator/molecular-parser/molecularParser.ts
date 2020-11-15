import {ATOMIC_MASS, AtomNameType} from "../constants";

export interface SubgroupType {
  formula: string,
  count: number
}

export type ParsedMolecule = { [Atom in AtomNameType]?: number }

/**
 * @param formula String A molecular formula, eg CH(CH(CH2)2)2OH
 * @return subgroups An array of first-level subgroups.
 * Eg [{formula: 'CH', count:1}, {formula:'CH(CH2)2', count:2,
 * {formula:'OH', count:1}]
 */
export const findSubgroups = function (formula: string): SubgroupType[] {
  let finishingNestedSubgroup;
  let subgroups: SubgroupType[] = [];
  let currentFormula = '', currentCount = '';
  let level = 0;

  //This pushes the current state of currentFormula and currentCount to subgroups.
  //It also resets currentFormula and currentCount.
  const pushSubgroup = function () {
    if (!currentFormula) return;
    const countStr = currentCount || '1';
    const count = parseInt(countStr, 10);
    subgroups.push({formula: currentFormula, count: count});
    currentFormula = '';
    currentCount = '';
  };

  let i=-1;

  for (let ch of formula) {
    i++
    if (/[A-Za-z]/.test(ch)) {
      if (finishingNestedSubgroup) {
        pushSubgroup();
        finishingNestedSubgroup = false;
      }
      currentFormula += ch;
      continue;
    } else if (ch === '(') {
      //If we are outside of parenthesis start a new subgroup
      if (level === 0 && currentFormula) {
        pushSubgroup();
      }
      if (level > 0) {
        //If we are in a subgroup, the ( is part of the formula
        currentFormula += ch;
      }
      level += 1;
    } else if (ch === ')') {
      level -= 1;
      if (level === 0) {
        //Finishing top-level subgroup; mark it so we can count multiples
        finishingNestedSubgroup = true;
      } else {
        //If we are in a subgroup, the ( is part of the formula
        currentFormula += ch;
      }
    } else if (/[*+]/.test(ch)) {
      if (level === 0 && currentFormula) {
        pushSubgroup();
        finishingNestedSubgroup = false
      }
      if (level > 0) {
        currentFormula += ch
      }
      level += 1
    } else if (/\d/.test(ch)) {
      // TODO check numbers > 9
      if (finishingNestedSubgroup) {
        currentCount += ch;
      } else {
        if (!currentFormula) {
          // Maybe like as 6H2O
          currentCount += ch
        } else {
          if (i === 0) {
            currentCount += ch
            continue
          }
          currentFormula += ch;
        }
      }
    }
  }
  //Once more to pick up any straggling formula
  pushSubgroup();
  return subgroups;
}

/**
 * @param formula String A primitive (ie, without subgroups/parentheses, like
 * CH4) molecular formula
 * @return elementCounts A map of element:count, eg {C:1, H:4}
 * @api private
 */
const _decomposePrimitiveFormula = function (formula: string): ParsedMolecule {
  let elementCounts: ParsedMolecule = {};
  let match = formula.match(elementRe)
  if (!match) {
    return elementCounts
  }
  for (let token of match) {
    //matcher will be of the form ['Na2', 'Na', '2', ...] or ['H', 'H', '', ...]
    let matcher = token.match(singleElementRe);
    if (!matcher) {
      continue
    }
    const element = matcher[1];
    const count = parseInt((matcher[2] || '1'), 10);

    if (!ATOMIC_MASS.hasOwnProperty(element)) {
      continue
    }
    let _el = element as AtomNameType
    if (element in elementCounts) {
      elementCounts[_el] = (elementCounts[_el] || 0) + count;
    } else {
      elementCounts[_el] = count;
    }
  }


  return elementCounts;
};
/**
 * @param formula String A molecular formula, eg CH(CH3)3
 * @return elementCounts A map of element:count, eg
 * {
 *   C: 4,
 *   H: 10
 * }
 */
export const decomposeFormula = function (formula: string): ParsedMolecule {
  if (!formula) return {};
  const subgroups = findSubgroups(formula);
  if (subgroups.length === 1 && subgroups[0].formula === formula) {
    //We have a primitive formula that we can just count!
    return _decomposePrimitiveFormula(formula);
  } else {
    //We have subgroups
    let combinedCounts: ParsedMolecule = {};
    subgroups.forEach(function (subgroup) {
      const subgroupCounts = decomposeFormula(subgroup.formula);
      let elementCount;
      for (let element in subgroupCounts) {
        if (ATOMIC_MASS.hasOwnProperty(element)) {
          let _el = element as AtomNameType
          elementCount = (subgroupCounts[_el] || 0) * subgroup.count;
          if (element in combinedCounts) {
            combinedCounts[_el] = (combinedCounts[_el] || 0) + elementCount;
          } else {
            combinedCounts[_el] = elementCount;
          }

        }
      }
    });
    return combinedCounts;
  }
}

let elementRe: RegExp = /([A-Z][a-z]{0,2})(\d*)/g
let singleElementRe: RegExp = /([A-Z][a-z]{0,2})(\d*)/


