import React from "react";

import { css } from "@emotion/react";
import { Link } from "@reach/router";

import logo from "../assets/y18.gif";

const styles = {
  container: css`
    margin: 0.5em auto;
    margin-bottom: 0;
    padding: 2px;
    background-color: #ff6600;
    width: 85%;
    display: flex;
    align-items: center;
    position: relative;
  `,
  logo: css`
    border: 1px white solid;
  `,
  link: css`
    text-decoration: none;
    color: #000;
  `,
  login: css`
    position: absolute;
    right: 0.5em;
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
        <Link
          to="/"
          css={css`
            ${styles.link};
            margin-left: 0.5em;
            font-weight: bold;
          `}
        >
          Hacker News
        </Link>

        <div>
          <Link
            to="/newest"
            css={css`
              ${styles.link} margin-left: 1em
            `}
          >
            new
          </Link>
          {" | "}
          <Link to="/front" css={styles.link}>
            past
          </Link>
          {" | "}
          <Link to="/newcomments" css={styles.link}>
            comments
          </Link>
          {" | "}
          <Link to="/ask" css={styles.link}>
            ask
          </Link>
          {" | "}
          <Link to="/show" css={styles.link}>
            show
          </Link>
          {" | "}
          <Link to="/jobs" css={styles.link}>
            jobs
          </Link>
          {" | "}
          <Link to="/submit" css={styles.link}>
            submit
          </Link>
        </div>

        <Link
          to="/login"
          css={css`
            ${styles.link}
            ${styles.login}
          `}
        >
          login
        </Link>
      </div>
    </header>
  );
};

export default Header;
