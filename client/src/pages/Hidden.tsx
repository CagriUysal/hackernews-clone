import React, { FunctionComponent } from "react";
import { RouteComponentProps } from "@reach/router";
import { useTheme, css } from "@emotion/react";
import { useQuery } from "@apollo/client";

import Header from "../components/Header";
import PostList from "../components/PostList";
import { HIDDEN_POSTS } from "../api/queries";

interface IProps extends RouteComponentProps {
  name?: string;
}

const Hidden: FunctionComponent<IProps> = ({ name }) => {
  const theme = useTheme();

  const { data } = useQuery(HIDDEN_POSTS, {
    variables: { name },
    fetchPolicy: "network-only",
  });

  if (data) {
    const { success, message, hidden } = data.hiddenPosts;

    if (success) {
      return (
        <div css={theme.layout}>
          <Header />
          <PostList posts={hidden} showFavorite={false} />
        </div>
      );
    } else {
      return (
        <p
          css={css`
            margin-left: 1em;
            margin-top: 1em;
          `}
        >
          {message}
        </p>
      );
    }
  } else {
    return null;
  }
};

export default Hidden;
