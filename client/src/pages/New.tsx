import React, { FunctionComponent } from "react";
import { RouteComponentProps } from "@reach/router";
import { useQuery } from "@apollo/client";
import { useTheme } from "@emotion/react";

import Header from "../components/Header";
import PostList from "../components/PostList";
import { LATEST_POSTS } from "../api/queries";

const New: FunctionComponent<RouteComponentProps> = () => {
  const theme = useTheme();

  const { data, refetch } = useQuery(LATEST_POSTS, {
    fetchPolicy: "network-only",
  });

  return (
    <div css={theme.layout}>
      <Header />
      {data && (
        <PostList
          posts={data.latestPosts}
          refetch={refetch}
          showFavorite={false}
        />
      )}
    </div>
  );
};

export default New;
