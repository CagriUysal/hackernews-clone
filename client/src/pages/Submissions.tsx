import React, { FunctionComponent } from "react";
import { useTheme } from "@emotion/react";
import { RouteComponentProps } from "@reach/router";
import { gql, useQuery } from "@apollo/client";

import Header from "../components/Header";
import PostList from "../components/PostList";

const USER_POSTS = gql`
  query UserPosts($name: String!) {
    userPosts(name: $name) {
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
    }
  }
`;

interface ComponentProps extends RouteComponentProps {
  name?: string;
}
const Submission: FunctionComponent<ComponentProps> = ({ name }) => {
  const theme = useTheme();
  const { data } = useQuery(USER_POSTS, { variables: { name } });

  return (
    <div css={theme.layout}>
      <Header />
      {data && <PostList posts={data.userPosts} />}
    </div>
  );
};

export default Submission;
