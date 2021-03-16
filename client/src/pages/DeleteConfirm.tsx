import React, { FunctionComponent } from "react";
import { RouteComponentProps, navigate } from "@reach/router";
import { useTheme, css } from "@emotion/react";
import { useMutation } from "@apollo/client";

import Header from "../components/Header";
import PostListItem from "../components/PostListItem";
import { DELETE_POST } from "../api/mutations";

const styles = {
  container: (theme) => css`
    margin-left: 2em;
    margin-top: 1em;
    padding-bottom: 1em;
    color: ${theme.colors.primary};
  `,
};

const DeleteConfirm: FunctionComponent<RouteComponentProps> = ({
  location,
}) => {
  const theme = useTheme();
  const [deletePost] = useMutation(DELETE_POST);

  if (location.state === null) {
    return (
      <p
        css={css`
          margin-top: 1em;
          margin-left: 1em;
        `}
      >
        You can't delete that.
      </p>
    );
  } else {
    const { post, forwardedFrom } = location?.state;
    const { id } = post;

    const handleYesClick = async () => {
      await deletePost({ variables: { postId: id } });

      navigate(forwardedFrom);
    };

    const handleNoClick = () => {
      navigate(forwardedFrom);
    };

    return (
      <div css={theme.layout}>
        <Header onlyTitle="Confirm" />
        <PostListItem
          post={post}
          showUpvote={false}
          showComments={false}
          showFavorite={false}
          showHide={false}
        />

        <div css={styles.container}>
          <p
            css={css`
              margin-bottom: 1em;
            `}
          >
            Do you want this to be deleted?
          </p>
          <button
            css={css`
              margin-right: 2em;
            `}
            onClick={handleYesClick}
          >
            Yes
          </button>
          <button onClick={handleNoClick}>No</button>
        </div>
      </div>
    );
  }
};

export default DeleteConfirm;
