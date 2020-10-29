import React from "react";
import {HashRouter as Router, Link, Route, Switch, useLocation} from "react-router-dom";
import loadable from "@loadable/component";

const components = {
  Calculator: loadable(() => import('@/components/Calculator')),
  FertilizerManager: loadable(() => import('@/components/Calculator/FertilizerManager')),
}


export default () => {
  return (
    <Router>
          <Switch>
            <Route exact path="/" component={components.Calculator}/>
            <Route path="/fertilizers" component={components.FertilizerManager}/>
          </Switch>
    </Router>
)
}
