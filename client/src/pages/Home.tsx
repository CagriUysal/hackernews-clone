import React, { FunctionComponent } from "react";

import { useQuery, gql } from "@apollo/client";

import Header from "../components/Header";
import Posts from "../components/Posts";

const ALL_POSTS = gql`
  query AllPosts {
    posts {
      title
      link
      author {
        name
      }
    }
  }
`;

const Home: FunctionComponent = () => {
  const { data } = useQuery(ALL_POSTS);

  return (
    <>
      <Header />
      {data && <Posts posts={data.posts} />}
    </>
  );
};

export default Home;
