import React from "react";
import { render } from "react-dom";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";

import { ApolloProvider } from "@apollo/client";
import { ThemeProvider } from "@emotion/react";

import client from "./client";
import App from "./App";
import { theme } from "./theme";

// @ts-ignore
TimeAgo.addDefaultLocale(en);

render(
  <ApolloProvider client={client}>
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  </ApolloProvider>,
  document.getElementById("root")
);
