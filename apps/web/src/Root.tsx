import { ForkMeOnGitHub, useColorMode } from "@fertilizer/ui";
import React, { type FunctionComponent } from "react";
import { Route, HashRouter as Router, Switch } from "react-router-dom";
import { TabMenu } from "@/components/navigation/TabMenu";
import pages from "./pages";

// Корневой компонент: без тем-провайдера (тема — CSS-переменные @fertilizer/ui)
// и без react-redux Provider (состояние — глобальный zustand-стор).
// Режим цвета живёт здесь: применяется к <html> при монтировании,
// независимо от того, открыт ли сайдбар.
const Root: FunctionComponent = () => {
  const [colorMode, setColorMode] = useColorMode();

  return (
    <Router>
      <div className="flex justify-between">
        <div className="p-1">
          <TabMenu colorMode={colorMode} onColorModeChange={setColorMode} />
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
  );
};

export default Root;
