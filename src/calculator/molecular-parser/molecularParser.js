
/**
 * @param formula String A molecular formula, eg CH(CH(CH2)2)2OH
 * @return subgroups An array of first-level subgroups.
 * Eg [{formula: 'CH', count:1}, {formula:'CH(CH2)2', count:2,
 * {formula:'OH', count:1}]
 */
var findSubgroups = function(formula) {
  var ch, finishingNestedSubgroup;
  var subgroups = [];
  var currentFormula = '', currentCount = '';
  var level = 0;

  //This pushes the current state of currentFormula and currentCount to subgroups.
  //It also resets currentFormula and currentCount.
  var pushSubgroup = function() {
    if (!currentFormula) return;
    var countStr = currentCount || '1';
    var count = parseInt(countStr, 10);
    subgroups.push({formula:currentFormula, count:count});
    currentFormula = '';
    currentCount = '';
  }

  for (var i in formula) {
    ch = formula[i];
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
      }
      if (level > 0) {
        currentFormula += ch
      }
      level += 1
    } else if (/\d/.test(ch)) {
      if (finishingNestedSubgroup) {
        currentCount += ch;
      } else {
        currentFormula += ch;
      }
    }
  }
  //Once more to pick up any straggling formula
  pushSubgroup();
  return subgroups;
}

/**
 * @param formula String A molecular formula, eg CH(CH3)3
 * @return elementCounts A map of element:count, eg
 * {
 *   C: 4,
 *   H: 10
 * }
 */
var decomposeFormula = function(formula) {
  if (!formula) return {};
  var subgroups = findSubgroups(formula);
  if (subgroups.length === 1) {
    //We have a primitive formula that we can just count!
    return _decomposePrimitiveFormula(formula);
  } else {
    //We have subgroups
    var combinedCounts = {};
    subgroups.forEach(function(subgroup) {
      var subgroupCounts = decomposeFormula(subgroup.formula)
      var elementCount;
      for (var element in subgroupCounts) {
        elementCount = subgroupCounts[element] * subgroup.count;
        if (element in combinedCounts) {
          combinedCounts[element] = combinedCounts[element] + elementCount;
        } else {
          combinedCounts[element] = elementCount;
        }
      }
    });
    return combinedCounts;
  }
}

var elementRe = /([A-Z][a-z]{0,2})(\d*)/g
var singleElementRe = /([A-Z][a-z]{0,2})(\d*)/
/**
 * @param formula String A primitive (ie, without subgroups/parentheses, like
 * CH4) molecular formula
 * @return elementCounts A map of element:count, eg {C:1, H:4}
 * @api private
 */
var _decomposePrimitiveFormula = function(formula) {
  var elementCounts = {};
  formula.match(elementRe).forEach(function(token) {
    //matcher will be of the form ['Na2', 'Na', '2', ...] or ['H', 'H', '', ...]
    var matcher = token.match(singleElementRe);
    var element = matcher[1];
    var count = parseInt( (matcher[2] || '1'), 10);
    if (element in elementCounts) {
      elementCounts[element] = elementCounts[element] + count;
    } else {
      elementCounts[element] = count;
    }
  });
  return elementCounts;
}

module.exports = {
  findSubgroups: findSubgroups,
  decomposeFormula: decomposeFormula
}

