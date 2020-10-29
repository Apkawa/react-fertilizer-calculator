import React, {FunctionComponent} from 'react'
import {Provider} from 'react-redux'
import {HashRouter as Router, Route, Switch} from 'react-router-dom'


import {ThemeProvider} from 'theme-ui'


import pages from './pages'
import {Box, Flex, Text} from "rebass";
import {defaultTheme} from "./themes";
import {ForkMeOnGitHub} from "./components/ui/ForkMeOnGitHub";
import {ColorModeToggle} from "./components/ColorModeToggle";
import {TabMenu} from "@/components/TabMenu";


type RootProps = {
  store: any
}

const Root: FunctionComponent<RootProps> = ({store}) => {
  return (
    <Provider store={store}>
      <ThemeProvider theme={defaultTheme}>
        <Flex justifyContent="space-between">
          <Box
            padding={3}
          >
            <ColorModeToggle/>
          </Box>
          <ForkMeOnGitHub/>
        </Flex>
        <Flex flexDirection='column' margin={2}>
          <Box flex={1}>
            <Router>
              <TabMenu/>

              <Flex sx={
                {
                  justifyContent: 'center'
                }
              }>
                <Box width='936px'>
                  <Switch>
                    <Route path={
                      [
                        "/formula/:formula?/:percent?",
                      ]} component={pages.ChemFormula}/>
                    <Route path="/example" component={pages.Example}/>
                    <Route path="/help" component={pages.Help}/>
                    <Route path="/" component={pages.Calculator}/>
                    <Route path="*" component={pages.NotFound}/>
                  </Switch>
                </Box>
              </Flex>
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
