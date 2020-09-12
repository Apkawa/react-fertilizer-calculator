import {ParsedMolecule, SubgroupType} from "./molecularParser";

const Parser = require('./molecularParser');



describe('molecularParser', function () {
  describe('findSubgroups', function () {
    const subgroupTestData: {[k: string]: SubgroupType[]} = {
      CH2O: [
        {
          formula: 'CH2O',
          count: 1
        }
      ],
      'CH(CH3)3': [
        {
          formula: 'CH',
          count: 1
        },
        {
          formula: 'CH3',
          count: 3
        }
      ],
      'CH(CH3)2OH': [
        {
          formula: 'CH',
          count: 1
        },
        {
          formula: 'CH3',
          count: 2
        },
        {
          formula: 'OH',
          count: 1
        }
      ],
      '(NH4)2SO4': [
        {
          formula: 'NH4',
          count: 2
        },
        {
          formula: 'SO4',
          count: 1
        },
      ],
      'C6H2(NO2)3(CH3)3': [
        {
          formula: 'C6H2',
          count: 1
        },
        {
          formula: 'NO2',
          count: 3
        },
        {
          formula: 'CH3',
          count: 3
        },
      ],
      'Ca(NO3)2 * 4H2O': [
        {
          "count": 1,
          "formula": "Ca"
        },
        {
          "count": 2,
          "formula": "NO3"
        },
        {
          "count": 4,
          "formula": "H2O"
        }
      ],
      '(NH4)2SO4 + (NH4)2HPO4 + K2SO4': [
        {
          "count": 2,
          "formula": "NH4"
        },
        {
          "count": 1,
          "formula": "SO4"
        },
        {
          "count": 1,
          "formula": "(NH4)2HPO4+K2SO4"
        }
      ],
    }

    it('should parse easy formulae correctly.', function () {
      for (let formula in subgroupTestData) {
        const res = Parser.findSubgroups(formula)
        expect(res).toEqual(subgroupTestData[formula]);
      }
    });

    it('should parse crazy formulae correctly.', function () {
      const formula = '(CH3)16(Tc(H2O)3CO(BrFe3(ReCl)3(SO4)2)2)2MnO4';
      const subgroups = [
        {
          formula: 'CH3',
          count: 16
        },
        {
          formula: 'Tc(H2O)3CO(BrFe3(ReCl)3(SO4)2)2',
          count: 2
        },
        {
          formula: 'MnO4',
          count: 1
        }
      ];
      const parsedSubgroups = Parser.findSubgroups(formula);
      expect(parsedSubgroups).toEqual(subgroups)
    });
  }); //end parseSubgroups

  describe('decomposeFormula', function () {
    const decomposeTestData: {[k: string]: ParsedMolecule} = {
      CH2O: {
        C: 1,
        H: 2,
        O: 1
      },
      'CH(CH3)3': {
        C: 4,
        H: 1 + 3 * 3
      },
      'CH(CH3)2OH': {
        C: 3,
        H: 8,
        O: 1
      },
      '(NH4)2SO4': {
        N: 2,
        H: 8,
        S: 1,
        O: 4
      },
      'C6H2(NO2)3(CH3)3': {
        C: 6 + 3,
        H: 2 + 9,
        N: 3,
        O: 2 * 3
      },
      '(NH4)2SO4 + (NH4)2HPO4 + K2SO4': {
        "H": 17,
        "K": 2,
        "N": 4,
        "O": 12,
        "P": 1,
        "S": 2
      }
    };

    it('should decompose formulae correctly', function () {
      for (let formula in decomposeTestData) {
        expect(Parser.decomposeFormula(formula)).toEqual(decomposeTestData[formula])
      }
    });

    it('should decompose crazy formulae correctly.', function () {
      const formula = '(CH3)16(Tc(H2O)3CO(BrFe3(ReCl)3(SO4)2)2)2MnO4';
      const decomposition = {
        C: 16 + 1 * 2,
        H: 3 * 16 + 2 * 3 * 2,
        Tc: 2,
        O: (3 + 1 + 4 * 2 * 2) * 2 + 4,
        Br: 1 * 2 * 2,
        Fe: 3 * 2 * 2,
        Re: 3 * 2 * 2,
        Cl: 3 * 2 * 2,
        S: 2 * 2 * 2,
        Mn: 1
      };
      const parsedDecomposition = Parser.decomposeFormula(formula);
      expect(parsedDecomposition).toEqual(decomposition)
    });
  });
});
