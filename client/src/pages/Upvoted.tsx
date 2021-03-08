import React, { FunctionComponent } from "react";
import { RouteComponentProps } from "@reach/router";
import { useTheme, css } from "@emotion/react";
import { gql, useQuery } from "@apollo/client";

import Header from "../components/Header";
import PostList from "../components/PostList";

const UPVOTED_POSTS = gql`
  query UpvotedPosts($name: String!) {
    upvotedPosts(name: $name) {
      code
      success
      message
      upvotes {
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
  }
`;

interface IProps extends RouteComponentProps {
  name?: string;
}

const Upvoted: FunctionComponent<IProps> = ({ name }) => {
  const theme = useTheme();

  const { data } = useQuery(UPVOTED_POSTS, { variables: { name }, fetchPolicy: "network-only" });

  if (data) {
    const { success, message, upvotes } = data.upvotedPosts;

    if (success) {
      return (
        <div css={theme.layout}>
          <Header />
          <PostList posts={upvotes} />
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

export default Upvoted;
