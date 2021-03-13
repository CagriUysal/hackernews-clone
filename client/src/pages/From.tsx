import React, { FunctionComponent } from "react";
import { useTheme } from "@emotion/react";
import { RouteComponentProps } from "@reach/router";
import { useQuery } from "@apollo/client";

import Header from "../components/Header";
import PostList from "../components/PostList";
import { DOMAIN_POSTS } from "../api/queries";

interface ComponentProps extends RouteComponentProps {
  domain?: string;
}

const From: FunctionComponent<ComponentProps> = ({ domain }) => {
  const theme = useTheme();

  const { data } = useQuery(DOMAIN_POSTS, { variables: { domain } });

  console.log(data);

  return (
    <div css={theme.layout}>
      <Header />
      {data && <PostList posts={data.domainPosts} />}
    </div>
  );
};

export default From;
