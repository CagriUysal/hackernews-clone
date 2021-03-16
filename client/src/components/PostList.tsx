import React, { FunctionComponent } from "react";

import PostListItem, { IPost } from "./PostListItem";

type ComponentProps = {
  posts: IPost[];
  showUpvote?: boolean;
  showComments?: boolean;
  showHide?: boolean;
  showFavorite?: boolean;
  refetch?: any;
};

const PostList: FunctionComponent<ComponentProps> = ({
  posts,
  refetch,
  showUpvote = true,
  showComments = true,
  showHide = true,
  showFavorite = true,
}) => {
  return (
    <main>
      {posts.map((post, index) => (
        <PostListItem
          post={post}
          rank={index + 1}
          key={`${post.createdAt}-${post.title}`}
          refetch={refetch}
          showUpvote={showUpvote}
          showComments={showComments}
          showHide={showHide}
          showFavorite={showFavorite}
        />
      ))}
    </main>
  );
};

export default PostList;
