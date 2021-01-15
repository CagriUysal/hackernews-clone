import React, { FunctionComponent, useState } from "react";

import { css } from "@emotion/react";

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
};

const Login: FunctionComponent = () => {
  const [loginName, setLoginName] = useState("");
  const [loginPass, setLoginPass] = useState("");
  const [registerName, setRegisterName] = useState("");
  const [registerPass, setRegisterPass] = useState("");

  const handleLoginClick = () => {
    console.log("login");
  };

  const handleRegisterClick = () => {
    console.log("register");
  };

  return (
    <div css={styles.container}>
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
              type="text"
              minLength={8}
              maxLength={72}
              value={loginPass}
              onChange={(event) => setLoginPass(event.target.value)}
            />
          </label>
        </div>
        <button css={styles.button} onClick={handleLoginClick}>
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
              type="text"
              minLength={8}
              maxLength={72}
              value={registerPass}
              onChange={(event) => setRegisterPass(event.target.value)}
            />
          </label>
        </div>
        <button css={styles.button} onClick={handleRegisterClick}>
          create account
        </button>
      </div>
    </div>
  );
};

export default Login;
