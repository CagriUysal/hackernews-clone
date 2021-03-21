import React, { FunctionComponent } from "react";
import { RouteComponentProps, Link } from "@reach/router";
import { useTheme, css } from "@emotion/react";
import { useQuery } from "@apollo/client";

import Header from "../components/Header";
import CommentList from "../components/CommentList";
import { FAVORITE_COMMENTS, ME } from "../api/queries";

const styles = {
  linkContainer: (theme) => css`
    color: ${theme.colors.primary};
    margin-top: 1rem;
    margin-left: 1rem;
    margin-bottom: 1rem;
  `,
};

interface ComponentProps extends RouteComponentProps {
  name?: string;
}

const FavoriteComments: FunctionComponent<ComponentProps> = ({ name }) => {
  const theme = useTheme();
  const { data } = useQuery(FAVORITE_COMMENTS, {
    variables: { name },
    fetchPolicy: "network-only",
  });
  const { data: meData } = useQuery(ME);

  if (data?.favoriteComments === null) {
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
  } else if (data?.favoriteComments) {
    const { name: currentUserName } = meData?.me;
    return (
      <div css={theme.layout}>
        <Header appendedTab={`${name}'s favorites`} />
        <div css={styles.linkContainer}>
          <Link to={`/user/${name}/favorites/submissions`}>submissions</Link>
          <span>{" | "}</span>
          <Link to={`/user/${name}/favorites/comments`}>comments</Link>
        </div>
        <CommentList
          comments={data.favoriteComments}
          extendAll
          showFavorite={currentUserName === name}
        />
      </div>
    );
  } else {
    return null;
  }
};

export default FavoriteComments;
