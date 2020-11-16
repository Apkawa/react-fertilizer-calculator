import loadable from '@loadable/component';
import NotFound from './NotFound'

export default {
  App: loadable(() => import('./App')),
  NotFound,
  Help: loadable(() => import('./Help')),
  Calculator: loadable(() => import('./Calculator')),
  ChemFormula: loadable(() => import('./ChemFormula')),
  DensityCalculator: loadable(() => import('./DensityCalculator')),
  Example: loadable(() => import('./Example')),
}
