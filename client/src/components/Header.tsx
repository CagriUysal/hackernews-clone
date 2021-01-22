import React, { FunctionComponent } from "react";

import { gql, useQuery } from "@apollo/client";
import { css } from "@emotion/react";
import { Link } from "@reach/router";

// @ts-ignore
import logo from "../assets/y18.gif";

const styles = {
  container: css`
    margin: 0.5em auto;
    margin-bottom: 0; // clear margin-bottom
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

const ME = gql`
  query Me {
    me {
      name
    }
  }
`;

const Header: FunctionComponent = () => {
  const currentPath = window.location.pathname;

  const { data, loading } = useQuery(ME, { fetchPolicy: "network-only" });

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
            margin-left: 0.5em;
            margin-right: 0.5em;
            font-weight: bold;
          `}
        >
          Hacker News
        </Link>

        <nav>
          {navigationMaps.map(({ name, path }, i) => (
            <React.Fragment key={path}>
              <Link
                to={path}
                css={css`
                  color: ${currentPath === path ? "#FFF" : undefined};
                `}
              >
                {name}
              </Link>
              <span>{i !== navigationMaps.length - 1 ? " | " : ""}</span>
            </React.Fragment>
          ))}
        </nav>

        <div
          css={css`
            ${styles.login}
          `}
        >
          {data && data.me && (
            <>
              <Link to="/user">{data.me.name}</Link>
              {" | "}
            </>
          )}
          <Link to="/login">login</Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
