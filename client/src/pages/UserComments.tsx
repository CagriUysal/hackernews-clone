import React, { FunctionComponent } from "react";
import { useTheme, css } from "@emotion/react";
import { RouteComponentProps } from "@reach/router";
import { gql, useQuery } from "@apollo/client";

import Header from "../components/Header";
import CommentList from "../components/CommentList";

const USER_COMMENTS = gql`
  query UserComments($name: String!) {
    userComments(name: $name) {
      id
      message
      createdAt
      parent {
        id
      }
      author {
        name
      }
      post {
        id
        title
      }
    }
  }
`;

interface ComponentProps extends RouteComponentProps {
  name?: string;
}
const UserComments: FunctionComponent<ComponentProps> = ({ name }) => {
  const theme = useTheme();
  const { data } = useQuery(USER_COMMENTS, { variables: { name } });

  if (data && data.userComments === null) {
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
  } else if (data && data.userComments) {
    return (
      <div css={theme.layout}>
        <Header />
        {<CommentList comments={data.userComments} extendAll showReply />}
      </div>
    );
  } else {
    return null;
  }
};

export default UserComments;
