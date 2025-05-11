import React, {FunctionComponent} from "react";
import ReactMarkdown from "react-markdown/with-html";
import {Box, Flex} from "rebass";
import {Switch, useParams} from "react-router-dom";
import {LazyPromise} from "@/components/LazyPromise";
import {useHelpPageMap} from "@/pages/Help/pages";


export const LazyHelpPage: FunctionComponent<{}> = () => {
  let {slug} = useParams()
  const pageMap = useHelpPageMap()
  const page = pageMap[slug || ""] || null

  return (
    page && <LazyPromise<string>
    lazy={page.lazy}
    component={({result}) => (
      <ReactMarkdown
        source={result || ""}
        escapeHtml={false}
        transformImageUri={uri => {
          let s = page.slug.split('/')[0]
          return uri.startsWith("http") ? uri : `./docs/${s}/${uri}`
        }
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

