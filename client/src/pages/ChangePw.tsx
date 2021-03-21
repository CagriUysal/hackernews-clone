import React, { FunctionComponent, useState, useContext } from "react";
import { navigate, Redirect, RouteComponentProps } from "@reach/router";
import { css, useTheme } from "@emotion/react";
import { useMutation } from "@apollo/client";

import Header from "../components/Header";
import { setAccessToken } from "../api/accessToken";
import { CHANGE_PW, LOG_OUT } from "../api/mutations";
import { MeContext } from "../api/meContext";

const styles = {
  container: (theme) => css`
    margin-top: 1em;
    color: ${theme.colors.primary};
    padding-bottom: 1em;
  `,
  label: css`
    display: inline-block;
    min-width: 10em;
    margin-bottom: 0.5em;
  `,
};

const ChangePw: FunctionComponent<RouteComponentProps> = () => {
  const theme = useTheme();
  const { me } = useContext(MeContext);

  const [changePw] = useMutation(CHANGE_PW, {
    async update(_, { data: { changePw } }) {
      const { success, message } = changePw;
      if (success === false) {
        setFeedBackMessage(message);
      } else {
        await handleLogOut();
        navigate("/");
      }
    },
  });
  const [logOut, { client }] = useMutation(LOG_OUT);

  const [feedbackMessage, setFeedBackMessage] = useState<null | string>(null);
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");

  const handleClick = () => {
    changePw({ variables: { input: { currentPw, newPw } } });
  };

  const handleLogOut = async () => {
    await logOut();
    setAccessToken("");
    await client.resetStore();
  };

  if (me === null) {
    return (
      <Redirect
        to="/login"
        state={{
          message: "Please log in.",
          redirectedFrom: `${window.location.pathname}`,
        }}
        noThrow
      />
    );
  } else {
    return (
      <div css={theme.layout}>
        <Header onlyTitle={`Reset password for ${me}`} />
        <div css={styles.container}>
          {feedbackMessage && (
            <p
              css={css`
                margin-bottom: 1em;
              `}
            >
              {feedbackMessage}
            </p>
          )}

          <div>
            <label htmlFor="current" css={styles.label}>
              Current Password:{" "}
            </label>
            <input
              type="password"
              name="current"
              id="current"
              value={currentPw}
              onChange={(event) => {
                setCurrentPw(event.target.value);
              }}
            />
          </div>

          <div>
            <label htmlFor="new" css={styles.label}>
              New Password:{" "}
            </label>
            <input
              type="password"
              name="new"
              id="new"
              value={newPw}
              onChange={(event) => {
                setNewPw(event.target.value);
              }}
            />
          </div>

          <button onClick={handleClick}>Change</button>
        </div>
      </div>
    );
  }
};

export default ChangePw;
