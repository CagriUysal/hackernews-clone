import React, { FunctionComponent, useContext } from "react";

import { useMutation } from "@apollo/client";
import { css } from "@emotion/react";
import { Link } from "@reach/router";

// @ts-ignore
import logo from "url:../assets/y18.gif";
import { setAccessToken } from "../api/accessToken";
import { LOG_OUT } from "../api/mutations";
import { MeContext } from "../api/MeContext";

const styles = {
  container: css`
    margin-top: 0.5em;
    padding: 2px;
    background-color: #ff6600;
    display: flex;
    justify-content: space-between;
    align-items: center;
    @media (max-width: 750px) {
      margin-top: 0;
      font-size: 0.9rem;
      padding-top: 0.5em;
      padding-bottom: 0.5em;
    }
  `,
  navigation: css`
    display: flex;
    align-items: center;
  `,
  logo: css`
    border: 1px white solid;
    margin-top
  `,
  login: css`
    margin-right: 0.5em;
    text-align: right;
    white-space: nowrap;
    margin-left: 0.5em;
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
    margin-left: 0.5rem;
    font-weight: bold;
    @media (max-width: 750px) {
      font-size: 1.1rem;
    }
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

const getCurrentPath = () => {
  // return current path without including page.
  const fullPath = window.location.pathname;
  const [, mainRoute] = fullPath.split("/");
  return `/${mainRoute}`;
};

type ComponentProps = {
  onlyTitle?: string; // if given, only the title shown and navigation is hidden
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
    <header css={styles.container}>
      <div css={styles.navigation}>
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
          <div
            css={css`
              @media (min-width: 750px) {
                display: flex; // make nav and title align in single row
                flex-wrap: wrap;
              }
            `}
          >
            <Link to="/" css={styles.title}>
              Hacker News
            </Link>

            <nav
              css={css`
                margin-left: 0.5rem;
              `}
            >
              {navigationMaps.map(({ name, path }, i) => (
                <React.Fragment key={path}>
                  <Link
                    to={path}
                    css={css`
                      color: ${getCurrentPath() === path &&
                      appendedTab === undefined // only highlight the appended tab
                        ? "#FFF"
                        : undefined};
                    `}
                  >
                    {name}
                  </Link>

                  {i !== navigationMaps.length - 1 && <span>{" | "}</span>}
                </React.Fragment>
              ))}

              {appendedTab && (
                <>
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
                </>
              )}
            </nav>
          </div>
        )}
      </div>

      {!onlyTitle && (
        <div
          css={css`
            ${styles.login};
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
      )}
    </header>
  );
};

export default Header;
