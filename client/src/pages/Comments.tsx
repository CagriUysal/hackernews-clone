import React, { FunctionComponent } from "react";
import { RouteComponentProps } from "@reach/router";
import { css, useTheme } from "@emotion/react";
import { gql, useQuery } from "@apollo/client";

import Header from "../components/Header";
import CommentList from "../components/CommentList";

const styles = {};

const COMMENTS = gql`
  query Comments {
    comments {
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

const Comments: FunctionComponent<RouteComponentProps> = () => {
  const theme = useTheme();
  const { data } = useQuery(COMMENTS);

  return (
    <div css={theme.layout}>
      <Header />
      {data && <CommentList comments={data.comments} extendAll />}
    </div>
  );
};

export default Comments;
