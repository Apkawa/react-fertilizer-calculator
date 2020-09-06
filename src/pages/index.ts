import loadable from '@loadable/component';
import NotFound from './NotFound'

export default {
  App: loadable(() => import('./App')),
  NotFound,
  Calculator: loadable(() => import('./Calculator'))
}
