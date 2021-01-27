import React, { FunctionComponent, useState } from "react";
import { css, useTheme } from "@emotion/react";
import { useQuery, gql, useMutation } from "@apollo/client";

import Header from "../components/Header";
import PostListItem from "../components/PostListItem";

const styles = {
  container: (theme) => css`
    background-color: ${theme.colors.bg};
  `,
  commentInput: css`
    width: 40em;
    margin-left: 2.5em;
    margin-top: 0.5em;
  `,
  button: css`
    display: block;
    margin-left: 2.5em;
    margin-top: 1em;
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

const ADD_COMMENT = gql`
  mutation AddComment($comment: AddCommentInput!) {
    addComment(comment: $comment) {
      code
      message
      comment {
        message
      }
    }
  }
`;

interface IAddCommentInput {
  message: string;
  postId: number;
  parentId: number | null;
}

type ComponentProps = {
  postId: string;
};

const Post: FunctionComponent<ComponentProps> = ({ postId }) => {
  const theme = useTheme();

  const { data } = useQuery(POST, {
    variables: { id: Number(postId) },
  });
  const [addComment, { data: addCommentData }] = useMutation(ADD_COMMENT);

  const [comment, setComment] = useState("");

  const handleAddComment = (comment: IAddCommentInput) => {
    addComment({ variables: { comment } });
  };

  if (data && data.post) {
    return (
      <div css={theme.layout}>
        <Header />
        <div css={styles.container}>
          <PostListItem post={data.post} rank={null} />

          <textarea
            name="text"
            id="text"
            css={styles.commentInput}
            rows={6}
            value={comment}
            onChange={(event) => setComment(event.target.value)}
          />

          <button
            css={styles.button}
            onClick={() =>
              handleAddComment({
                message: comment,
                postId: Number(postId),
                parentId: null,
              })
            }
          >
            add comment
          </button>
        </div>
      </div>
    );
  } else if (data && data.post === null) {
    return <p>No such item.</p>;
  }

  return null;
};

export default Post;
