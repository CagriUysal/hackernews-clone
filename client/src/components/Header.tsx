import React, { FunctionComponent } from "react";

import { gql, useMutation, useQuery } from "@apollo/client";
import { css } from "@emotion/react";
import { Link } from "@reach/router";

// @ts-ignore
import logo from "../assets/y18.gif";
import { setAccessToken } from "../api/accessToken";

const styles = {
  container: css`
    margin-top: 0.5em;
    padding: 2px;
    background-color: #ff6600;
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
  logout: css`
    border: none;
    background-color: inherit;
    font-size: inherit;
    font-family: inherit;
    cursor: pointer;
    padding: 0;
  `,
  title: css`
    margin-left: 0.5em;
    margin-right: 0.5em;
    font-weight: bold;
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

const LOG_OUT = gql`
  mutation Logout {
    logout
  }
`;

type ComponentProps = {
  // if given, only the title shown and navigation is hidden
  onlyTitle?: string;
};

const Header: FunctionComponent<ComponentProps> = ({ onlyTitle }) => {
  const currentPath = window.location.pathname;

  const { data } = useQuery(ME, { fetchPolicy: "network-only" });
  const [logOut, { client }] = useMutation(LOG_OUT);

  const handleLogout = async () => {
    await logOut();
    setAccessToken("");
    await client.resetStore();
  };

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

        {onlyTitle ? (
          <p css={styles.title}>{onlyTitle}</p>
        ) : (
          <Link to="/" css={styles.title}>
            Hacker News
          </Link>
        )}

        {!onlyTitle && (
          <>
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
              {data?.me ? (
                <>
                  <Link to={`/user/${data.me.name}`}>{data.me.name}</Link>
                  {" | "}
                  <button css={styles.logout} onClick={handleLogout}>
                    logout
                  </button>
                </>
              ) : (
                <Link to="/login">login</Link>
              )}
            </div>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
