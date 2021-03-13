import React, { FunctionComponent, useEffect, useState } from "react";
import { navigate, Redirect, RouteComponentProps } from "@reach/router";
import { css, useTheme } from "@emotion/react";
import { useQuery, gql, useMutation } from "@apollo/client";

import Header from "../components/Header";
import { setAccessToken } from "../api/accessToken";

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

const ME = gql`
  query me {
    me {
      name
    }
  }
`;

const CHANGE_PW = gql`
  mutation ChangePw($input: ChangePwInput!) {
    changePw(input: $input) {
      success
      message
      code
    }
  }
`;

const LOG_OUT = gql`
  mutation Logout {
    logout
  }
`;

const ChangePw: FunctionComponent<RouteComponentProps> = () => {
  const theme = useTheme();

  const { data } = useQuery(ME, { fetchPolicy: "network-only" });
  const [changePw, { data: changePwData }] = useMutation(CHANGE_PW);
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

  useEffect(() => {
    (async function () {
      if (changePwData) {
        const { success, message } = changePwData.changePw;
        if (success === false) {
          setFeedBackMessage(message);
        } else {
          await handleLogOut();
          navigate("/");
        }
      }
    })();
  }, [changePwData]);

  if (data?.me === null) {
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
  } else if (data?.me) {
    const { name } = data?.me;

    return (
      <div css={theme.layout}>
        <Header onlyTitle={`Reset password for ${name}`} />
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
  } else {
    // data loading
    return null;
  }
};

export default ChangePw;
