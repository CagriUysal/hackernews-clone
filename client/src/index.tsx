import React from "react";
import { render } from "react-dom";

import { ApolloProvider } from "@apollo/client";
import { ThemeProvider } from "@emotion/react";

import client from "./api/client";
import App from "./App";
import MeContextProvider from "./api/meContext";
import { theme } from "./theme";

render(
  <ApolloProvider client={client}>
    <ThemeProvider theme={theme}>
      <MeContextProvider>
        <App />
      </MeContextProvider>
    </ThemeProvider>
  </ApolloProvider>,
  document.getElementById("root")
);
