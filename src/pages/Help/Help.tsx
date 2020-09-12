import React, {FunctionComponent} from "react";
import ReactMarkdown from "react-markdown";
import {Box, Flex} from "rebass";
import {Link, Route, Switch, useRouteMatch} from "react-router-dom";
import {LazyPromise} from "@/components/LazyPromise";


const HELP_PAGES = [
  {
    path: '',
    name: 'Как использовать',
    lazy: () => import("!!raw-loader!../../docs/how_to_use.md").then(m => m.default)
  },
  {
    path: '/technique',
    name: 'Методика расчета',
    lazy: () => import("!!raw-loader!../../docs/technique.md").then(m => m.default)
  }
]


interface HelpProps {
}

export const Help: FunctionComponent<HelpProps> = () => {
  let { path, url } = useRouteMatch();


  return (
    <Flex justifyContent={"center"}>
      <Box maxWidth="960px">
        <Link to="/">
          Калькулятор
        </Link>
        <Flex sx={{
          float: "left",
          margin: 3,
          marginTop: 5,
        }}>
          <ul>
            {HELP_PAGES.map(p =>
              <li><Link to={url + p.path}>{p.name}</Link></li>
            )}
          </ul>

        </Flex>
        <Switch>
          {HELP_PAGES.map(p =>
            <Route exact path={path + p.path}>
              <LazyPromise<string>
                lazy={p.lazy}
                component={({result}) => <ReactMarkdown source={result || ""}/>}
              />
            </Route>
          )}
        </Switch>
      </Box>
    </Flex>
  )
}

