import React, { FunctionComponent } from "react";
import { RouteComponentProps } from "@reach/router";
import { useTheme, css } from "@emotion/react";
import { gql, useQuery } from "@apollo/client";

import Header from "../components/Header";
import PostList from "../components/PostList";

const FAVORITE_POSTS = gql`
  query FavoritePosts($name: String!) {
    favoritePosts(name: $name) {
      id
      title
      link
      domain
      upvote
      createdAt
      author {
        name
      }
      comments {
        id
      }
      currentUserFavorited
      currentUserUpvoted
    }
  }
`;

interface ComponentProps extends RouteComponentProps {
  name?: string;
}

const Favorites: FunctionComponent<ComponentProps> = ({ name }) => {
  const theme = useTheme();
  const { data } = useQuery(FAVORITE_POSTS, {
    variables: { name },
    fetchPolicy: "network-only",
  });

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
        <Header />
        <PostList posts={data.favoritePosts} />
      </div>
    );
  } else {
    return null;
  }
};

export default Favorites;
