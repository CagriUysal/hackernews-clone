import React, { FunctionComponent } from "react";
import { css } from "@emotion/react";

import CommentListItem, { IComment } from "./CommentListItem";

const styles = {
  container: css``,
};

type ComponentProps = {
  comments: IComment[];
};

const PostList: FunctionComponent<ComponentProps> = ({ comments }) => {
  return (
    <main css={styles.container}>
      {comments.map((comment) => (
        <CommentListItem
          comment={comment}
          key={`${comment.createdAt}-${comment.author.name}`}
        />
      ))}
    </main>
  );
};

export default PostList;
