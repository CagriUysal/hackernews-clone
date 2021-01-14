import React, { FunctionComponent } from "react";

import { css } from "@emotion/react";

type ComponentProps = {
  post: IPost;
};

const Post: FunctionComponent<ComponentProps> = ({ post }) => {
  console.log(post);

  return (
    <p>
      {post.title}, {post.link}
    </p>
  );
};

export default Post;

export interface IPost {
  title: string;
  link: string;
  author: {
    name: string;
  };
}
