import React, {
  FunctionComponent,
  useEffect,
  useContext,
  useState,
} from "react";

import { Router } from "@reach/router";
import { Global, css } from "@emotion/react";

import { TokenContext, CHANGE_TOKEN } from "./components/TokenContext";

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
  const { dispatch } = useContext(TokenContext);

  useEffect(() => {
    // prevent login in every refresh
    fetch("http://localhost:3000/refresh", {
      method: "POST",
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        const { accessToken } = data;
        dispatch({ type: CHANGE_TOKEN, payload: { accessToken } });
      });
  }, []);

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
    </>
  );
};

export default App;
