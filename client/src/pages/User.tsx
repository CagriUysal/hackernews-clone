import React, { FunctionComponent, useState, useEffect } from "react";
import { css, useTheme } from "@emotion/react";
import { RouteComponentProps } from "@reach/router";
import { useQuery, useMutation } from "@apollo/client";
import { Link } from "@reach/router";
import { formatDistanceToNowStrict } from "date-fns";

import Header from "../components/Header";
import { USER } from "../api/queries";
import { UPDATE_USER } from "../api/mutations";

const styles = {
  container: (theme) =>
    css`
      background-color: ${theme.colors.bg};
      color: ${theme.colors.primary};
      padding-top: 1em;
      padding-bottom: 2em;
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
    text-decoration: underline;
  `,
};

interface ComponentProps extends RouteComponentProps {
  name?: string;
}

const User: FunctionComponent<ComponentProps> = ({ name }) => {
  const theme = useTheme();

  const [about, setAbout] = useState("");
  const [email, setEmail] = useState("");

  const { data } = useQuery(USER, {
    variables: { name },
    fetchPolicy: "network-only",
  });

  const [updateUser] = useMutation(UPDATE_USER, {
    update: (cache, { data: { updateUser } }) => {
      const {
        success,
        user: { email },
      } = updateUser;

      if (success === false) {
        return; // unsuccessful. don't update cache.
      }

      // clear email input field after update.
      if (email === null) {
        setEmail("");
      } else {
        setEmail(email);
      }

      // cache update is necessary for helper message to be shown or removed
      const { user } = cache.readQuery({
        query: USER,
        variables: { name },
      });

      cache.writeQuery({
        query: USER,
        variables: { name },
        data: {
          user: { ...user, email }, // update email
        },
      });
    },
  });

  const updateClickHandler = () => {
    updateUser({ variables: { input: { email, about } } });
  };

  useEffect(() => {
    if (data?.user) {
      const { about, email } = data.user;

      setAbout(about);

      if (email !== null) setEmail(email);
      else setEmail("");
    }
  }, [data]);

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
    const { name, createdAt, karma, __typename } = data.user;
    const isPrivateUser = __typename === "PrivateUser";

    return (
      <div css={theme.layout}>
        <Header />
        <div css={styles.container}>
          {isPrivateUser && data.user.email === null && (
            <p
              css={css`
                background-color: #ffffaa;
                padding: 0.4em;
                margin-bottom: 0.5em;
              `}
            >
              Please put a valid address in the email field, or we won't be able
              to send you a new password if you forget yours. Your address is
              only visible to you and us. Crawlers and other users can't see it.
            </p>
          )}
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
              <textarea
                cols={60}
                rows={5}
                value={about}
                onChange={(event) => setAbout(event.target.value)}
              />
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
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </div>
          )}
          <div css={styles.links}>
            {isPrivateUser && (
              <div>
                <Link to={`/changepw`} css={styles.link}>
                  change password
                </Link>
              </div>
            )}

            <div>
              <Link to={`/user/${name}/submissions`} css={styles.link}>
                submissions
              </Link>
            </div>

            <div>
              <Link to={`/user/${name}/comments`} css={styles.link}>
                comments
              </Link>
            </div>

            <div>
              {isPrivateUser && (
                <Link to={`/user/${name}/hidden`} css={styles.link}>
                  hidden
                </Link>
              )}
            </div>

            <div>
              {isPrivateUser && (
                <Link
                  to={`/user/${name}/upvoted/submissions`}
                  css={styles.link}
                >
                  upvoted submissions
                </Link>
              )}
            </div>

            <div>
              <Link to={`/user/${name}/favorites`} css={styles.link}>
                favorites
              </Link>
            </div>
          </div>
          {isPrivateUser && (
            <button onClick={updateClickHandler}>update</button>
          )}
        </div>
      </div>
    );
  } else {
    return null;
  }
};

export default User;
