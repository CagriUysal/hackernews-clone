import React from "react";
import { render } from "react-dom";

import { ApolloProvider } from "@apollo/client";

import { TokenProvider } from "./components/TokenContext";
import client from "./client";
import App from "./App";

render(
  <ApolloProvider client={client}>
    <TokenProvider>
      <App />
    </TokenProvider>
  </ApolloProvider>,
  document.getElementById("root")
);
