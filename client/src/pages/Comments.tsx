import React, { FunctionComponent } from "react";
import { RouteComponentProps } from "@reach/router";
import { useTheme } from "@emotion/react";
import { useQuery } from "@apollo/client";

import Header from "../components/Header";
import CommentList from "../components/CommentList";
import { COMMENTS } from "../api/queries";

const Comments: FunctionComponent<RouteComponentProps> = () => {
  const theme = useTheme();
  const { data } = useQuery(COMMENTS, { fetchPolicy: "network-only" });

  return (
    <div css={theme.layout}>
      <Header />
      {data && <CommentList comments={data.comments} extendAll />}
    </div>
  );
};

export default Comments;
