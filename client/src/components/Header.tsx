import React, { FunctionComponent, useContext } from "react";

import { useMutation } from "@apollo/client";
import { css } from "@emotion/react";
import { Link } from "@reach/router";

// @ts-ignore
import logo from "../assets/y18.gif";
import { setAccessToken } from "../api/accessToken";
import { LOG_OUT } from "../api/mutations";
import { MeContext } from "../api/meContext";

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

type ComponentProps = {
  // if given, only the title shown and navigation is hidden
  onlyTitle?: string;
  appendedTab?: string;
};

const Header: FunctionComponent<ComponentProps> = ({
  onlyTitle,
  appendedTab,
}) => {
  const { me } = useContext(MeContext);

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
                      color: ${window.location.pathname === path
                        ? "#FFF"
                        : undefined};
                    `}
                  >
                    {name}
                  </Link>
                  {i !== navigationMaps.length - 1 && <span>{" | "}</span>}
                </React.Fragment>
              ))}
            </nav>

            {appendedTab && (
              <div>
                <span
                  css={css`
                    white-space: pre;
                  `}
                >
                  {" | "}
                </span>
                <span
                  css={css`
                    color: #fff;
                  `}
                >
                  {appendedTab}
                </span>
              </div>
            )}

            <div
              css={css`
                ${styles.login}
              `}
            >
              {me ? (
                <>
                  <Link to={`/user/${me}`}>{me}</Link>
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
