Molecular Parser
----------------

This is a simple tool that takes a molecular formula such as CH(CH2)2OH, and
returns a map from elemental symbol to its count in the molecule.

```javascript
Parser = require('molecularParser');

var elementCounts = Parser.decomposeFormula('CH(CH2)2OH');
// { C:3, H:6, O:1 }

var crazyCounts = Parser.decomposeFormula('(CH3)16(Tc(H2O)3CO(BrFe3(ReCl)3(SO4)2)2)2MnO4');
// { C: 18, H: 60, Tc: 2, O: 44, Br: 4, Fe: 12, Re: 12, Cl: 12, S: 8, Mn: 1 }
```


