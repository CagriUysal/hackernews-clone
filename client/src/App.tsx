import React from "react";

import { Router } from "@reach/router";
import { Global, css } from "@emotion/react";

import Home from "./pages/Home";

const App = (): React.ReactElement => {
  return (
    <>
      <Global
        styles={css`
          * {
            box-sizing: border-box;
            margin: 0;
          }

          html,
          body {
            margin: 0;
            font-family: Verdana, Geneva, Tahoma, sans-serif;
            font-size: 16px;
            line-height: 1.4;
          }
        `}
      />
      <Router>
        <Home path="/" />
      </Router>
    </>
  );
};

export default App;
