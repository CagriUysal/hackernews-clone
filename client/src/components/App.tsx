import React from "react";

import { Global, css } from "@emotion/react";

import Header from "./Header";

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
      <Header />
    </>
  );
};

export default App;
