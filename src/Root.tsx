import React, {FunctionComponent} from 'react'
import {Provider} from 'react-redux'
import {HashRouter as Router, Route, Switch} from 'react-router-dom'

import {ThemeProvider} from 'theme-ui'

import pages from './pages'
import {Box, Flex} from "rebass";

const presets: any = require('@theme-ui/presets')

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
      <Flex flexDirection='column' margin={2}>
        <Box flex={1}>
          <Router>
            <Switch>
              <Route exact path="/" component={pages.Calculator}/>
              <Route path="*" component={pages.NotFound}/>
            </Switch>
          </Router>
        </Box>
        <Flex justifyContent={"flex-end"} marginTop="auto" flex={1}>
          <Box>
            {__VERSION__} {__COMMIT_HASH__}
          </Box>
        </Flex>
      </Flex>
    </ThemeProvider>
  </Provider>
)

export default Root
