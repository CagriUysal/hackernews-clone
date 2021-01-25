import React, { FunctionComponent } from "react";

import { useQuery, gql } from "@apollo/client";
import { useTheme } from "@emotion/react";

import Header from "../components/Header";
import Posts from "../components/Posts";

const ALL_POSTS = gql`
  query AllPosts {
    posts {
      title
      link
      upvote
      createdAt
      author {
        name
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
      {data && <Posts posts={data.posts} />}
    </div>
  );
};

export default Home;
