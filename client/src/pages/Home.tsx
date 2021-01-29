import React, { FunctionComponent } from "react";

import { useQuery, gql } from "@apollo/client";
import { useTheme } from "@emotion/react";

import Header from "../components/Header";
import PostList from "../components/PostList";

const ALL_POSTS = gql`
  query AllPosts {
    posts {
      id
      title
      link
      upvote
      createdAt
      author {
        name
      }
      comments {
        id
      }
    }
  }
`;

const Home: FunctionComponent = () => {
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
