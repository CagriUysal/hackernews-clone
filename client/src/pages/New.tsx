import React, { FunctionComponent } from "react";
import { Link, RouteComponentProps } from "@reach/router";
import { useQuery } from "@apollo/client";
import { useTheme } from "@emotion/react";

import Header from "../components/Header";
import PostList from "../components/PostList";
import { LATEST_POSTS } from "../api/queries";
import { ITEM_PER_PAGE } from "../../../common/constants";

interface IProps extends RouteComponentProps {
  page?: string;
}

const New: FunctionComponent<IProps> = ({ page }) => {
  const _page = page ? Number(page) : undefined;

  const theme = useTheme();
  const { data, refetch } = useQuery(LATEST_POSTS, {
    fetchPolicy: "network-only",
    variables: { page: _page },
  });

  if (data) {
    const { latestPosts } = data;

    return (
      <div css={theme.layout}>
        <Header />
        {data && (
          <PostList
            posts={latestPosts}
            refetch={refetch}
            showFavorite={false}
          />
        )}
        {latestPosts.length === ITEM_PER_PAGE && (
          <div css={theme.pageButton}>
            <Link to={`/newest/${_page ? _page + 1 : 2}`}>More</Link>
          </div>
        )}
      </div>
    );
  } else {
    return null;
  }
};

export default New;
