import loadable from "@loadable/component";
import React from "react";
import { Route, HashRouter as Router, Switch } from "react-router-dom";

const components = {
  Calculator: loadable(() => import("@/components/Calculator")),
  FertilizerManager: loadable(() => import("@/components/Calculator/FertilizerManager")),
};

export default () => {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={components.Calculator} />
        <Route path="/fertilizers" component={components.FertilizerManager} />
      </Switch>
    </Router>
  );
};
