import React, { FunctionComponent } from "react";
import { useQuery, gql } from "@apollo/client";
import { useTheme } from "@emotion/react";
import { RouteComponentProps } from "@reach/router";

import Header from "../components/Header";
import PostList from "../components/PostList";

const ALL_POSTS = gql`
  query AllPosts {
    posts {
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
    }
  }
`;

const Home: FunctionComponent<RouteComponentProps> = () => {
  const theme = useTheme();

  const { data } = useQuery(ALL_POSTS);

  return (
    <div css={theme.layout}>
      <Header />
      {data && <PostList posts={data.posts} />}
    </div>
  );
};

export default Home;
