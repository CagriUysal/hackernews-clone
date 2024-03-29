import React, { FunctionComponent, useState, useContext } from "react";
import { css } from "@emotion/react";
import { useMutation } from "@apollo/client";
import { navigate, RouteComponentProps } from "@reach/router";

import { setAccessToken } from "../api/accessToken";
import { REGISTER, LOGIN } from "../api/mutations";
import { MeContext } from "../api/MeContext";
import validateRegister from "../utils/validateRegister";

const styles = {
  container: css`
    margin: 1em;
    font-family: "Times New Roman", Times, serif;
  `,
  formInput: css`
    margin-bottom: 0.25em;
  `,
  button: css`
    margin-top: 1em;
    margin-bottom: 1em;
  `,
  feedback: css`
    margin-bottom: 1em;
  `,
};

interface IUser {
  name: string;
  password: string;
}

const Login: FunctionComponent<RouteComponentProps> = ({ location }) => {
  const { refetch } = useContext(MeContext);

  const [loginName, setLoginName] = useState("");
  const [loginPass, setLoginPass] = useState("");
  const [registerName, setRegisterName] = useState("");
  const [registerPass, setRegisterPass] = useState("");
  const [feedbackMessage, setFeedbackMessage] = useState<null | string>(
    location?.state.message
  );

  const [register] = useMutation(REGISTER, {
    update(_, { data: { register } }) {
      const { success, message } = register;
      if (success === false) {
        setFeedbackMessage(message);
      } else if (success === true) {
        // auto-fill login info after user creation
        setFeedbackMessage("User craeted succesfully.");
        setLoginName(registerName);
        setLoginPass(registerPass);
      }
    },
  });

  const [login] = useMutation(LOGIN, {
    async update(_, { data: { login } }) {
      const { message, success, accessToken } = login;
      if (success === false) {
        setFeedbackMessage(message);
      } else {
        setAccessToken(accessToken);
        await refetch(); // update `ME` query
        navigate(
          `${
            location?.state.redirectedFrom
              ? `${location.state.redirectedFrom}`
              : "/"
          }`
        );
      }
    },
  });

  const handleLoginClick = (user: IUser) => {
    login({ variables: { user } });
  };

  const handleRegisterClick = (user: IUser) => {
    try {
      validateRegister(user);
    } catch (err) {
      setFeedbackMessage(err.message);
      return;
    }

    register({ variables: { user } });
  };

  return (
    <div css={styles.container}>
      {/* feedback */}
      {feedbackMessage && <p css={styles.feedback}>{feedbackMessage}</p>}

      {/* login form */}
      <div>
        <b>Login</b>
        <br />
        <br />
        <div css={styles.formInput}>
          <label>
            {" "}
            username:{" "}
            <input
              type="text"
              minLength={2}
              maxLength={15}
              value={loginName}
              onChange={(event) => setLoginName(event.target.value)}
            />
          </label>
        </div>
        <div css={styles.formInput}>
          <label>
            {" "}
            password:{" "}
            <input
              type="password"
              minLength={8}
              maxLength={72}
              value={loginPass}
              onChange={(event) => setLoginPass(event.target.value)}
            />
          </label>
        </div>
        <button
          css={styles.button}
          onClick={() =>
            handleLoginClick({ name: loginName, password: loginPass })
          }
        >
          login
        </button>
      </div>

      {/* create account form */}
      <div>
        <b>Create Account</b>
        <br />
        <br />
        <div css={styles.formInput}>
          <label>
            {" "}
            username:{" "}
            <input
              type="text"
              minLength={2}
              maxLength={15}
              value={registerName}
              onChange={(event) => setRegisterName(event.target.value)}
            />
          </label>
        </div>
        <div css={styles.formInput}>
          <label>
            {" "}
            password:{" "}
            <input
              type="password"
              minLength={8}
              maxLength={72}
              value={registerPass}
              onChange={(event) => setRegisterPass(event.target.value)}
            />
          </label>
        </div>
        <button
          css={styles.button}
          onClick={() =>
            handleRegisterClick({ name: registerName, password: registerPass })
          }
        >
          create account
        </button>
      </div>
    </div>
  );
};

export default Login;
