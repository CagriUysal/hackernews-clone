import React, { FunctionComponent, useEffect, useState } from "react";

import { Router } from "@reach/router";
import { Global, css } from "@emotion/react";

import refreshAccessToken from "./utils/refreshAccessToken";
import { setAccessToken } from "./api/accessToken";

import Home from "./pages/Home";
import New from "./pages/New";
import Past from "./pages/Past";
import Comments from "./pages/Comments";
import Ask from "./pages/Ask";
import Show from "./pages/Show";
import Jobs from "./pages/Jobs";
import Submit from "./pages/Submit";
import Login from "./pages/Login";
import Post from "./pages/Post";
import Comment from "./pages/Comment";
import From from "./pages/From";
import User from "./pages/User";
import Submissions from "./pages/Submissions";
import UserComments from "./pages/UserComments";
import Favorites from "./pages/Favorites";
import ChangePw from "./pages/ChangePw";
import DeleteConfirm from "./pages/DeleteConfirm";
import UpvotedSubmissions from "./pages/UpvotedSubmissions";
import Hidden from "./pages/Hidden";
import UpvotedComments from "./pages/UpvotedComments";

const App: FunctionComponent = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // prevent login in every refresh
    const fetchToken = async () => {
      try {
        const response = await refreshAccessToken();
        const { accessToken } = await response.json();

        setAccessToken(accessToken);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchToken();
  }, []);

  if (loading) {
    return null;
  }

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
            font-size: 14px;
            line-height: 1.4;
          }
          a {
            text-decoration: none;
            color: inherit;
          }
          button {
            font-family: Verdana, Geneva, Tahoma, sans-serif;
            font-size: 0.8rem;
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
        <Post path="/post/:postId" />
        <Comment path="/post/:postId/comment/:commentId" />
        <From path="/from/:domain" />
        <User path="/user/:name" />
        <Submissions path="/user/:name/submissions" />
        <UserComments path="/user/:name/comments" />
        <Favorites path="/user/:name/favorites" />
        <ChangePw path="/changepw" />
        <DeleteConfirm path="/delete-confirm" />
        <UpvotedSubmissions path="/user/:name/upvoted/submissions" />
        <UpvotedComments path="/user/:name/upvoted/comments" />
        <Hidden path="/user/:name/hidden" />
      </Router>
    </>
  );
};

export default App;
