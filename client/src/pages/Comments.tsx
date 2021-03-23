import React, { FunctionComponent } from "react";
import { Link, RouteComponentProps } from "@reach/router";
import { useTheme, css } from "@emotion/react";
import { useQuery } from "@apollo/client";

import Header from "../components/Header";
import CommentList from "../components/CommentList";
import { COMMENTS } from "../api/queries";
import { ITEM_PER_PAGE } from "../../../common/constants";

interface IProps extends RouteComponentProps {
  page?: string;
}

const Comments: FunctionComponent<IProps> = ({ page }) => {
  const _page = page ? Number(page) : undefined;

  const theme = useTheme();
  const { data } = useQuery(COMMENTS, {
    fetchPolicy: "network-only",
    variables: { page: _page },
  });

  if (data) {
    const { comments } = data;
    return (
      <div css={theme.layout}>
        <Header />
        {data && <CommentList comments={comments} extendAll />}
        {comments.length === ITEM_PER_PAGE && (
          <div
            css={css`
              margin-left: 1.1rem;
              margin-top: 1rem;
            `}
          >
            <Link to={`/newcomments/${_page ? _page + 1 : 2}`}>More</Link>
          </div>
        )}
      </div>
    );
  } else {
    return null;
  }
};

export default Comments;
