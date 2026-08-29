import { ForkMeOnGitHub } from "@fertilizer/ui";
import React, { type FunctionComponent } from "react";
import { Route, HashRouter as Router, Switch } from "react-router-dom";
import { Box, Flex, Text } from "rebass";
import { ThemeProvider } from "theme-ui";
import { TabMenu } from "@/components/navigation/TabMenu";
import pages from "./pages";
import { defaultTheme } from "./themes";

// Корневой компонент: без react-redux Provider (состояние — глобальный zustand-стор).
const Root: FunctionComponent = () => {
  return (
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
  );
};

export default Root;
