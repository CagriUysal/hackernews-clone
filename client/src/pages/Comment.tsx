import React, { FunctionComponent, useState } from "react";
import { css, useTheme } from "@emotion/react";
import { RouteComponentProps } from "@reach/router";
import { useQuery, gql, useMutation } from "@apollo/client";
import { Redirect } from "@reach/router";

import Header from "../components/Header";
import CommentListItem from "../components/CommentListItem";
import CommentList from "../components/CommentList";
import validateComment from "../utils/validateComment";

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
    margin-bottom: 3em;
  `,
  errorMessage: (theme) => css`
    color: ${theme.colors.primary};
    padding: 1em;
  `,
};

const COMMENT = gql`
  query Comment($id: Int!) {
    comment(id: $id) {
      message
      createdAt
      parent {
        id
      }
      author {
        name
      }
      post {
        id
        title
      }
    }
  }
`;

const ADD_COMMENT = gql`
  mutation AddComment($comment: AddCommentInput!) {
    addComment(comment: $comment) {
      code
      success
      message
      comment {
        message
      }
    }
  }
`;

const POST_COMMENTS = gql`
  query PostComments($postId: Int!) {
    postComments(postId: $postId) {
      id
      message
      createdAt
      parent {
        id
      }
      author {
        name
      }
      post {
        id
        title
      }
    }
  }
`;

interface IAddCommentInput {
  message: string;
  postId: number;
  parentId: number | null;
}

interface ComponentProps extends RouteComponentProps {
  commentId?: string;
  postId?: string;
}

const Comment: FunctionComponent<ComponentProps> = ({ commentId, postId }) => {
  const theme = useTheme();

  const { data } = useQuery(COMMENT, { variables: { id: Number(commentId) } });
  const [addComment, { data: addCommentData }] = useMutation(ADD_COMMENT);
  const { data: postCommentsData } = useQuery(POST_COMMENTS, {
    variables: { postId: Number(postId) },
  });

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [comment, setComment] = useState("");

  const handleAddComment = (comment: IAddCommentInput) => {
    try {
      validateComment(comment.message);
    } catch {
      setErrorMessage("Please try again.");
      return;
    }

    addComment({ variables: { comment } });
  };

  if (addCommentData) {
    const { success, code } = addCommentData.addComment;
    if (success === false && code === "401") {
      return (
        <Redirect
          to="/login"
          noThrow
          state={{ message: "You have to be logged in to comment." }}
        />
      );
    } else if (success === true) {
      if (errorMessage !== null) setErrorMessage(null);
    }
  }

  if (data && data.comment) {
    return (
      <div css={theme.layout}>
        <Header />
        <main css={styles.container}>
          <div
            css={css`
              padding-bottom: 1em;
            `}
          >
            {errorMessage && <p css={styles.errorMessage}>{errorMessage}</p>}
            <CommentListItem comment={data.comment} extendedDisplay />

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
                  parentId: Number(commentId),
                })
              }
            >
              reply
            </button>
          </div>

          <div
            css={css`
              padding-bottom: 3em;
            `}
          >
            {postCommentsData && (
              <CommentList
                comments={postCommentsData.postComments}
                parentId={Number(commentId)}
                nest
                showReply
              />
            )}
          </div>
        </main>
      </div>
    );
  } else if (data && data.comment === null) {
    return <p>No such item.</p>;
  }

  return null;
};

export default Comment;
