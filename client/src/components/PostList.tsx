import React, { FunctionComponent } from "react";

import PostListItem, { IPost } from "./PostListItem";

type ComponentProps = {
  posts: IPost[];
};

const PostList: FunctionComponent<ComponentProps> = ({ posts }) => {
  return (
    <main>
      {posts.map((post, index) => (
        <PostListItem
          post={post}
          rank={index + 1}
          key={`${post.createdAt}-${post.title}`}
        />
      ))}
    </main>
  );
};

export default PostList;
