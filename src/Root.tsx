import React, {FunctionComponent} from 'react'
import {Provider} from 'react-redux'
import {HashRouter as Router, Route, Switch} from 'react-router-dom'

import {ThemeProvider} from 'theme-ui'

import pages from './pages'

const presets : any = require('@theme-ui/presets')

// example theme.js
const defaultTheme = {
  ...presets.polaris,
  card: {
    boxShadow: 'small',
    p: 2,
  },

  shadows: {
    small: '0 0 4px rgba(0, 0, 0, .125)',
    large: '0 0 24px rgba(0, 0, 0, .125)'
  },
}

type RootProps = {
  store: any
}
const Root: FunctionComponent<RootProps> = ({store}) => (
  <Provider store={store}>
    <ThemeProvider theme={defaultTheme}>
      <Router>
        <Switch>
          <Route exact path="/" component={pages.App}/>
          <Route path="/calculator" component={pages.Calculator}/>
          <Route path="*" component={pages.NotFound}/>
        </Switch>
      </Router>
    </ThemeProvider>
  </Provider>
)

export default Root
