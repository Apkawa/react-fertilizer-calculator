import React, {FunctionComponent} from "react";
import ReactMarkdown from "react-markdown";
import {Box, Flex} from "rebass";
import {Link} from "react-router-dom";

/* eslint import/no-webpack-loader-syntax: off */
const HowToUse = require("!!raw-loader!../../docs/how_to_use.md").default;


interface HelpProps {
}

export const Help: FunctionComponent<HelpProps> = () => {
  return (
    <Flex justifyContent={"center"}>
      <Box maxWidth="960px">
        <Link to="/">
          Калькулятор
        </Link>
        <ReactMarkdown source={HowToUse}/>
      </Box>
    </Flex>
  )
}

