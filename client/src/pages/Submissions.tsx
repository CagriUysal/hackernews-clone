import React, { FunctionComponent } from "react";
import { useTheme, css } from "@emotion/react";
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
  const { data, loading } = useQuery(USER_POSTS, { variables: { name } });

  if (data && data.userPosts === null) {
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
  } else if (data && data.userPosts) {
    return (
      <div css={theme.layout}>
        <Header />
        {<PostList posts={data.userPosts} />}
      </div>
    );
  } else if (loading) {
    return null;
  }
};

export default Submission;
