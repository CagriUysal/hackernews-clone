import React, { FunctionComponent, useState, useEffect } from "react";
import { css, useTheme } from "@emotion/react";
import { RouteComponentProps } from "@reach/router";
import { useQuery, useMutation } from "@apollo/client";
import { navigate } from "@reach/router";

import Header from "../components/Header";
import CommentListItem from "../components/CommentListItem";
import CommentList from "../components/CommentList";
import validateComment from "../../../common/validateComment";
import { COMMENT, POST_COMMENTS } from "../api/queries";
import { ADD_COMMENT } from "../api/mutations";

const styles = {
  container: (theme) => css`
    background-color: ${theme.colors.bg};
    margin-left: 1em;
  `,
  commentInput: css`
    width: 40em;
    margin-left: 1rem;
    margin-top: 0.5em;
  `,
  button: css`
    display: block;
    margin-left: 1rem;
    margin-top: 1em;
    margin-bottom: 3em;
  `,
  errorMessage: (theme) => css`
    color: ${theme.colors.primary};
    padding: 1em;
  `,
};

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
  const { data: postCommentsData } = useQuery(POST_COMMENTS, {
    variables: { postId: Number(postId) },
  });

  const [addComment, { data: addCommentData }] = useMutation(ADD_COMMENT, {
    update(cache, { data: { addComment } }) {
      const { comment } = addComment;

      if (comment === null) {
        return; // unsuccessful. don't update cache.
      }

      const { postComments } = cache.readQuery({
        query: POST_COMMENTS,
        variables: { postId: Number(postId) },
      });

      cache.writeQuery({
        query: POST_COMMENTS,
        variables: { postId: Number(postId) },
        data: {
          postComments: [...postComments, comment],
        },
      });
    },
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

  useEffect(() => {
    if (addCommentData) {
      const { success, code } = addCommentData.addComment;
      if (success === false && code === "401") {
        navigate("/login", {
          state: {
            message: "You have to be logged in to comment.",
            redirectedFrom: `/post/${postId}/comment/${commentId}`,
          },
        });
      } else if (success === true) {
        if (errorMessage !== null) setErrorMessage(null);
        setComment("");
      }
    }
  }, [addCommentData]);

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
