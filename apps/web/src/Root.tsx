import { ForkMeOnGitHub } from "@fertilizer/ui";
import React, { type FunctionComponent } from "react";
import { Route, HashRouter as Router, Switch } from "react-router-dom";
import { ThemeProvider } from "theme-ui";
import { TabMenu } from "@/components/navigation/TabMenu";
import pages from "./pages";
import { defaultTheme } from "./themes";

// Корневой компонент: без react-redux Provider (состояние — глобальный zustand-стор).
const Root: FunctionComponent = () => {
  return (
    <ThemeProvider theme={defaultTheme}>
      <Router>
        <div className="flex justify-between">
          <div className="p-1">
            <TabMenu />
          </div>
          <ForkMeOnGitHub />
        </div>
        <div className="flex flex-col m-2">
          <div className="flex-1">
            <div className="flex justify-center">
              <div style={{ width: 936 }}>
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
              </div>
            </div>
          </div>
          <div className="flex justify-end mt-auto flex-1">
            <span className="text-base">
              {__VERSION__}-{__COMMIT_REF_NAME__} {__COMMIT_HASH__} [{__COMMIT_DATE__}]
            </span>
          </div>
        </div>
      </Router>
    </ThemeProvider>
  );
};

export default Root;
