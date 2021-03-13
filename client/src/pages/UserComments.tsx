import React, { FunctionComponent } from "react";
import { useTheme, css } from "@emotion/react";
import { RouteComponentProps } from "@reach/router";
import { useQuery } from "@apollo/client";

import Header from "../components/Header";
import CommentList from "../components/CommentList";
import { USER_COMMENTS } from "../api/queries";

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
