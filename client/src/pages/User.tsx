import React, { FunctionComponent } from "react";
import { css, useTheme } from "@emotion/react";
import { RouteComponentProps } from "@reach/router";
import { gql, useQuery } from "@apollo/client";
import { Link } from "@reach/router";
import { formatDistanceToNowStrict } from "date-fns";

import Header from "../components/Header";

const styles = {
  container: (theme) =>
    css`
      background-color: ${theme.colors.bg};
      color: ${theme.colors.primary};
      padding-top: 1em;
      padding-bottom: 2em;
      font-size: 0.9em;
    `,
  infoKey: css`
    min-width: 4.5em;
    display: inline-block;
  `,
  links: css`
    margin-left: 4.5em; // align with info
    margin-top: 1em;
    margin-bottom: 1em;
  `,
  link: css`
    display: block;
    text-decoration: underline;
  `,
};

const USER = gql`
  query User($name: String!) {
    user(name: $name) {
      __typename
      id
      name
      createdAt
      karma
      about
      ... on PrivateUser {
        email
      }
    }
  }
`;

interface ComponentProps extends RouteComponentProps {
  name?: string;
}

const User: FunctionComponent<ComponentProps> = ({ name }) => {
  const theme = useTheme();

  const { data } = useQuery(USER, {
    variables: { name },
    fetchPolicy: "network-only",
  });

  if (data?.user === null) {
    return (
      <p
        css={css`
          padding: 1em;
          font-family: "Times New Roman", Times, serif;
        `}
      >
        No such user.
      </p>
    );
  } else if (data?.user) {
    const { name, createdAt, karma, about, __typename } = data.user;
    const isPrivateUser = __typename === "PrivateUser";

    return (
      <div css={theme.layout}>
        <Header />
        <div css={styles.container}>
          <div>
            <span css={styles.infoKey}>user: </span>
            {name}
          </div>
          <div>
            <span css={styles.infoKey}>created: </span>
            {formatDistanceToNowStrict(createdAt, {
              addSuffix: true,
            })}
          </div>
          <div>
            <span css={styles.infoKey}>karma: </span>
            {karma}
          </div>
          <div>
            <span
              css={css`
                ${styles.infoKey}
                vertical-align:top;
              `}
            >
              about:{" "}
            </span>
            {isPrivateUser ? (
              <textarea cols={60} rows={5} defaultValue={about} />
            ) : (
              <span>{about}</span>
            )}
          </div>
          {isPrivateUser && (
            <div>
              <span css={styles.infoKey}>email: </span>
              <input
                type="text"
                css={css`
                  width: 35em;
                `}
                defaultValue={data.user.email}
              />
            </div>
          )}
          <div css={styles.links}>
            {isPrivateUser && (
              <Link to={`/changepw`} css={styles.link}>
                change password
              </Link>
            )}
            <Link to={`/user/${name}/submissions`} css={styles.link}>
              submissions
            </Link>
            <Link to={`/user/${name}/comments`} css={styles.link}>
              comments
            </Link>
            {isPrivateUser && (
              <Link to={`/user/${name}/hidden`} css={styles.link}>
                hidden
              </Link>
            )}
            {isPrivateUser && (
              <Link to={`/user/${name}/upvoted`} css={styles.link}>
                upvoted submissions
              </Link>
            )}
            <Link to={`/user/${name}/favorites`} css={styles.link}>
              favorites
            </Link>
          </div>
          {isPrivateUser && <button>update</button>}
        </div>
      </div>
    );
  } else {
    return null;
  }
};

export default User;
