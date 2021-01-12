import React from "react";

import { css } from "@emotion/react";

import logo from "../assets/y18.gif";

const styles = {
  container: css`
    display: flex;
    margin: 0.5em auto;
    margin-bottom: 0;
    padding: 2px;
    background-color: #ff6600;
    width: 85%;
  `,
  logo: css`
    border: 1px white solid;
  `,
};

const Header = (): React.ReactElement => {
  return (
    <header>
      <div css={styles.container}>
        <img
          src={logo}
          width="20px"
          height="20px"
          alt="hackernews logo"
          css={styles.logo}
        />
      </div>
    </header>
  );
};

export default Header;
