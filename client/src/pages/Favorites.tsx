import React, { FunctionComponent } from "react";
import { RouteComponentProps } from "@reach/router";
import { useTheme, css } from "@emotion/react";
import { useQuery } from "@apollo/client";

import Header from "../components/Header";
import PostList from "../components/PostList";
import { FAVORITE_POSTS, ME } from "../api/queries";

interface ComponentProps extends RouteComponentProps {
  name?: string;
}

const Favorites: FunctionComponent<ComponentProps> = ({ name }) => {
  const theme = useTheme();
  const { data } = useQuery(FAVORITE_POSTS, {
    variables: { name },
    fetchPolicy: "network-only",
  });
  const { data: meData } = useQuery(ME);

  if (data && data.favoritePosts === null) {
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
  } else if (data && data.favoritePosts) {
    return (
      <div css={theme.layout}>
        <Header appendedTab={`${name}'s favorites`} />
        <PostList
          posts={data.favoritePosts}
          showHide={false}
          showFavorite={meData?.me?.name === name}
        />
      </div>
    );
  } else {
    return null;
  }
};

export default Favorites;
