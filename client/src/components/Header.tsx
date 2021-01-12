import React, { useState } from "react";

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

const navigationMaps = [
  {
    name: "new",
    path: "/newest",
  },
  {
    name: "past",
    path: "/front",
  },
  {
    name: "comments",
    path: "/newcomments",
  },
  {
    name: "ask",
    path: "/ask",
  },
  {
    name: "show",
    path: "/show",
  },
  {
    name: "jobs",
    path: "/jobs",
  },
  {
    name: "submit",
    path: "/submit",
  },
];

const Header = (): React.ReactElement => {
  const currentPath = window.location.pathname;

  return (
    <header>
      <div css={styles.container}>
        <Link
          to="/"
          css={css`
            display: flex;
            align-items: center;
          `}
        >
          <img
            src={logo}
            width="20px"
            height="20px"
            alt="hackernews logo"
            css={styles.logo}
          />
        </Link>

        <Link
          to="/"
          css={css`
            ${styles.link};
            margin-left: 0.5em;
            margin-right: 0.5em;
            font-weight: bold;
          `}
        >
          Hacker News
        </Link>

        <nav>
          {navigationMaps.map(({ name, path }, i) => (
            <>
              <Link
                to={path}
                key={path}
                css={css`
                  ${styles.link}
                  color: ${currentPath === path ? "#FFF" : undefined}
                `}
              >
                {name}
              </Link>
              {i !== navigationMaps.length - 1 ? " | " : ""}
            </>
          ))}
        </nav>

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
