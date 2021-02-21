import posts from "./resolvers/posts";
import post from "./resolvers/post";
import me from "./resolvers/me";
import addPost from "./resolvers/addPost";
import login from "./resolvers/login";
import register from "./resolvers/register";
import logout from "./resolvers/logout";
import addComment from "./resolvers/addComment";
import postComments from "./resolvers/postComments";
import comments from "./resolvers/comments";
import comment from "./resolvers/comment";
import domainPosts from "./resolvers/domainPosts";
import latestPosts from "./resolvers/latestPosts";
import pastPosts from "./resolvers/pastPosts";
import user from "./resolvers/user";
import userPosts from "./resolvers/userPosts";
import userComments from "./resolvers/userComments";
import addFavorite from "./resolvers/addFavorite";
import removeFavorite from "./resolvers/removeFavorite";
import favoritePosts from "./resolvers/favoritePosts";

export const resolvers = {
  Response: {
    __resolveType: (response): string => {
      if (response.post) return "Post";
      if (response.user) return "User";
    },
  },

  Query: {
    posts,
    post,
    domainPosts,
    latestPosts,
    pastPosts,
    userPosts,
    favoritePosts,
    postComments,
    comments,
    comment,
    userComments,
    me,
    user,
  },

  Mutation: {
    addPost,
    addComment,
    addFavorite,
    removeFavorite,
    login,
    register,
    logout,
  },
};
