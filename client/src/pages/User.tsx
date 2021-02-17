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
  `,
  link: css`
    display: block;
    text-decoration: underline;
  `,
};

const USER = gql`
  query User($name: String!) {
    user(name: $name) {
      name
      createdAt
      karma
    }
  }
`;

interface ComponentProps extends RouteComponentProps {
  name?: string;
}

const User: FunctionComponent<ComponentProps> = ({ name }) => {
  const theme = useTheme();

  const { data, loading } = useQuery(USER, { variables: { name } });

  if (loading) {
    return null;
  }

  if (data && data.user === null) {
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
  } else if (data && data.user) {
    const { name, createdAt, karma } = data.user;

    return (
      <div css={theme.layout}>
        <Header />
        <div css={styles.container}>
          <p>
            <span css={styles.infoKey}>user: </span>
            {name}
          </p>
          <p>
            <span css={styles.infoKey}>created: </span>
            {formatDistanceToNowStrict(createdAt, {
              addSuffix: true,
            })}
          </p>
          <p>
            <span css={styles.infoKey}>karma: </span>
            {karma}
          </p>
          <p>
            <span css={styles.infoKey}>about: </span>
          </p>
          <div css={styles.links}>
            <Link to={`/user/${name}/submissions`} css={styles.link}>
              submissions
            </Link>
            <Link to={`/user/${name}/comments`} css={styles.link}>
              comments
            </Link>
            <Link to={`/user/${name}/favorites`} css={styles.link}>
              favorites
            </Link>
          </div>
        </div>
      </div>
    );
  }
};

export default User;
