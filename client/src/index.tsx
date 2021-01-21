import React from "react";
import { render } from "react-dom";

import { ApolloProvider } from "@apollo/client";

import client from "./client";
import App from "./App";

render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById("root")
);
