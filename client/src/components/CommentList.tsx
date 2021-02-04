import React, { FunctionComponent } from "react";
import { css } from "@emotion/react";

import CommentListItem, { IComment } from "./CommentListItem";

const styles = {
  container: (theme) => css`
    background-color: ${theme.colors.bg};
  `,
};

interface lookupValue extends IComment {
  children: lookupValue[];
}

const nestComments = (
  comments: IComment[],
  parentId: null | number = null
): lookupValue[] => {
  interface lookupTable {
    [key: number]: lookupValue;
  }

  const hash: lookupTable = {};
  comments.forEach((comment) => {
    hash[comment.id] = { ...comment, children: [] };
  });

  const tree: lookupValue[] = [];
  comments.forEach((comment) => {
    let isParent;

    if (parentId === null && comment.parent === null) {
      isParent = true;
    } else if (parentId !== null && comment.parent !== null) {
      isParent = parentId === comment.parent.id;
    } else {
      isParent = false;
    }

    if (isParent) {
      tree.push(hash[comment.id]);
    } else if (comment.parent !== null) {
      hash[comment.parent.id].children.push(hash[comment.id]);
    }
  });

  return tree;
};

const getOrderedComments = (
  comments: IComment[],
  parentId: number | null = null
): [lookupValue, number][] => {
  const list: [lookupValue, number][] = [];

  const preOrderTraverse = (root: lookupValue, level = 0) => {
    if (root === null) {
      return;
    }

    list.push([root, level]);
    root.children.forEach((child) => preOrderTraverse(child, level + 1));
  };

  const nestedComments = nestComments(comments, parentId);
  nestedComments.map((rootComment) => {
    preOrderTraverse(rootComment);
  });

  return list;
};

type ComponentProps = {
  comments: IComment[];
  parentId?: number | null;
};

const PostList: FunctionComponent<ComponentProps> = ({
  comments,
  parentId = null,
}) => {
  console.log(parentId);
  const orderedComments = getOrderedComments(comments, parentId);

  return (
    <main css={styles.container}>
      {orderedComments.map(([comment, level]) => {
        return (
          <CommentListItem
            comment={comment}
            key={`${comment.createdAt}-${comment.author.name}`}
            level={level}
          />
        );
      })}
    </main>
  );
};

export default PostList;
