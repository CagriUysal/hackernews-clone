import React, { FunctionComponent } from "react";
import { useQuery } from "@apollo/client";
import { useTheme } from "@emotion/react";
import { Link, RouteComponentProps } from "@reach/router";

import Header from "../components/Header";
import PostList from "../components/PostList";
import { HOME_POSTS } from "../api/queries";
import { ITEM_PER_PAGE } from "../../../common/constants";

interface IProps extends RouteComponentProps {
  page?: string;
}

const Home: FunctionComponent<IProps> = ({ page }) => {
  const _page = page ? Number(page) : undefined;

  const theme = useTheme();
  const { data, refetch } = useQuery(HOME_POSTS, {
    fetchPolicy: "network-only",
    variables: { page: _page },
  });

  if (data) {
    const { homePosts } = data;

    return (
      <div css={theme.layout}>
        <Header />
        {data && (
          <PostList posts={homePosts} refetch={refetch} showFavorite={false} />
        )}
        {homePosts.length === ITEM_PER_PAGE && (
          <div css={theme.pageButton}>
            <Link to={`/${_page ? _page + 1 : 2}`}>More</Link>
          </div>
        )}
      </div>
    );
  } else {
    return null;
  }
};

export default Home;
