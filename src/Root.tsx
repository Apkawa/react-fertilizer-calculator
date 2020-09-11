import React, {FunctionComponent} from 'react'
import {Provider} from 'react-redux'
import {HashRouter as Router, Route, Switch} from 'react-router-dom'
import {ThemeProvider} from 'theme-ui'


import pages from './pages'
import {Box, Flex, Text} from "rebass";
import {defaultTheme} from "./theme";
import {ForkMeOnGitHub} from "./components/ui/ForkMeOnGitHub";
import {ColorModeToggle} from "./components/ColorModeToggle";


type RootProps = {
  store: any
}

const Root: FunctionComponent<RootProps> = ({store}) => {


  return (
    <Provider store={store}>
      <ThemeProvider theme={defaultTheme}>
        <Flex justifyContent="space-between">
          <Box padding={3}>
            <ColorModeToggle/>
          </Box>
          <ForkMeOnGitHub/>
        </Flex>

        <Flex flexDirection='column' margin={2}>
          <Box flex={1}>
            <Router>
              <Switch>
                <Route exact path="/" component={pages.Calculator}/>
                <Route path="/example" component={pages.Example}/>
                <Route path="*" component={pages.NotFound}/>
              </Switch>
            </Router>
          </Box>
          <Flex justifyContent={"flex-end"} marginTop="auto" flex={1}>
            <Text fontSize={1}>
              {__VERSION__} {__COMMIT_HASH__} [{__COMMIT_DATE__}]
            </Text>
          </Flex>
        </Flex>
      </ThemeProvider>
    </Provider>
  )
}

export default Root
