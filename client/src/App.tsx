import React, { FunctionComponent } from "react";

import { Router } from "@reach/router";
import { Global, css } from "@emotion/react";
import { ApolloProvider } from "@apollo/client";

import { TokenProvider } from "./components/TokenContext";
import client from "./client";

import Home from "./pages/Home";
import New from "./pages/New";
import Past from "./pages/Past";
import Comments from "./pages/Comments";
import Ask from "./pages/Ask";
import Show from "./pages/Show";
import Jobs from "./pages/Jobs";
import Submit from "./pages/Submit";
import Login from "./pages/Login";

const App: FunctionComponent = () => {
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
          a {
            text-decoration: none;
            color: inherit;
          }
        `}
      />
      <ApolloProvider client={client}>
        <TokenProvider>
          <Router>
            <Home path="/" />
            <New path="/newest" />
            <Past path="/front" />
            <Comments path="/newcomments" />
            <Ask path="/ask" />
            <Show path="/show" />
            <Jobs path="/jobs" />
            <Submit path="/submit" />
            <Login path="/login" />
          </Router>
        </TokenProvider>
      </ApolloProvider>
    </>
  );
};

export default App;
