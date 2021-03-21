import React, { FunctionComponent } from "react";
import { RouteComponentProps } from "@reach/router";
import { useTheme, css } from "@emotion/react";
import { useQuery } from "@apollo/client";

import Header from "../components/Header";
import CommentList from "../components/CommentList";
import { UPVOTED_COMMENTS } from "../api/queries";

interface IProps extends RouteComponentProps {
  name?: string;
}

const UpvotedComments: FunctionComponent<IProps> = ({ name }) => {
  const theme = useTheme();

  const { data } = useQuery(UPVOTED_COMMENTS, {
    variables: { name },
    fetchPolicy: "network-only",
  });

  if (data) {
    const { success, message, upvotes } = data.upvotedComments;

    if (success) {
      return (
        <div css={theme.layout}>
          <Header appendedTab="upvoted" />
          <CommentList comments={upvotes} extendAll />
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

export default UpvotedComments;
