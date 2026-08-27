import React, { type FunctionComponent } from "react";
import { Provider } from "react-redux";
import { Route, HashRouter as Router, Switch } from "react-router-dom";
import { Box, Flex, Text } from "rebass";
import { ThemeProvider } from "theme-ui";
import { TabMenu } from "@/components/ui/TabMenu/TabMenu";
import { ForkMeOnGitHub } from "./components/ui/ForkMeOnGitHub";
import pages from "./pages";
import { defaultTheme } from "./themes";

type RootProps = {
  store: any;
};

const Root: FunctionComponent<RootProps> = ({ store }) => {
  return (
    <Provider store={store}>
      <ThemeProvider theme={defaultTheme}>
        <Router>
          <Flex justifyContent="space-between">
            <Box padding={1}>
              <TabMenu />
            </Box>
            <ForkMeOnGitHub />
          </Flex>
          <Flex flexDirection="column" margin={2}>
            <Box flex={1}>
              <Flex
                sx={{
                  justifyContent: "center",
                }}
              >
                <Box width="936px">
                  <Switch>
                    <Route path={["/formula/:formula?/:percent?"]} component={pages.ChemFormula} />
                    <Route
                      path={["/density/:formula?/:concentration?/:density?/"]}
                      component={pages.DensityCalculator}
                    />
                    <Route path="/example" component={pages.Example} />
                    <Route path="/help/:slug*" component={pages.Help} />
                    <Route path="/" component={pages.Calculator} />
                    <Route path="*" component={pages.NotFound} />
                  </Switch>
                </Box>
              </Flex>
            </Box>
            <Flex justifyContent={"flex-end"} marginTop="auto" flex={1}>
              <Text fontSize={1}>
                {__VERSION__}-{__COMMIT_REF_NAME__} {__COMMIT_HASH__} [{__COMMIT_DATE__}]
              </Text>
            </Flex>
          </Flex>
        </Router>
      </ThemeProvider>
    </Provider>
  );
};

export default Root;
