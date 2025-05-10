import React, {FunctionComponent} from "react";
import ReactMarkdown from "react-markdown";
import {Box, Flex} from "rebass";
import {Switch, useParams} from "react-router-dom";
import {LazyPromise} from "@/components/LazyPromise";
import {HELP_PAGE_MAP} from "@/pages/Help/pages";


export const LazyHelpPage: FunctionComponent<{}> = () => {
  let {slug} = useParams()
  const page = HELP_PAGE_MAP[slug || ""] || null

  return (
    page && <LazyPromise<string>
    lazy={page.lazy}
    component={({result}) => (
      <ReactMarkdown
        source={result || ""}
        transformImageUri={uri =>
          uri.startsWith("http") ? uri : `./docs/${page.path}/${uri}`
        }
      />
    )}
  />
  )
}


interface HelpProps {
}

export const Help: FunctionComponent<HelpProps> = () => {
  return (
    <Flex justifyContent={"center"}>
      <Box maxWidth="960px">
        <Flex sx={{
          float: "right",
          margin: 3,
          marginTop: 5,
        }}>
        </Flex>
        <Switch>
          <LazyHelpPage />
        </Switch>
      </Box>
    </Flex>
  )
}

