import React, { FunctionComponent } from "react";
import { css, useTheme } from "@emotion/react";
import { useQuery, gql } from "@apollo/client";

import Header from "../components/Header";
import PostListItem from "../components/PostListItem";

const styles = {
  container: (theme) => css`
    background-color: ${theme.colors.bg};
  `,
};

const POST = gql`
  query Post($id: Int!) {
    post(id: $id) {
      id
      title
      link
      upvote
      createdAt
      author {
        name
      }
    }
  }
`;

type ComponentProps = {
  postId: string;
};

const Post: FunctionComponent<ComponentProps> = ({ postId }) => {
  const theme = useTheme();
  const { data } = useQuery(POST, {
    variables: { id: Number(postId) },
  });

  if (data && data.post) {
    return (
      <div css={theme.layout}>
        <Header />
        <div css={styles.container}>
          <PostListItem post={data.post} rank={null} />
        </div>
      </div>
    );
  } else if (data && data.post === null) {
    return <p>No such item.</p>;
  }

  return null;
};

export default Post;
