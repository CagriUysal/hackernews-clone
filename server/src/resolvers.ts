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
import upvotePost from "./resolvers/upvotePost";
import unvotePost from "./resolvers/unvotePost";
import updateUser from "./resolvers/updateUser";
import changePw from "./resolvers/changePw";
import deletePost from "./resolvers/deletePost";
import upvotedPosts from "./resolvers/upvotedPosts";
import addHidden from "./resolvers/addHidden";
import removeHidden from "./resolvers/removeHidden";
import hiddenPosts from "./resolvers/hiddenPosts";
import upvoteComment from "./resolvers/upvoteComment";
import unvoteComment from "./resolvers/unvoteComment";
import addFavoriteComment from "./resolvers/addFavoriteComment";

export const resolvers = {
  User: {
    __resolveType: (user): string => {
      if (user.hidden) return "PrivateUser";
      else return "PublicUser";
    },
  },

  Query: {
    // Post
    post,
    domainPosts,
    latestPosts,
    pastPosts,
    userPosts,
    favoritePosts,
    upvotedPosts,
    hiddenPosts,

    // Comment
    comments,
    comment,
    postComments,
    userComments,

    // User
    me,
    user,
  },

  Mutation: {
    // Post
    addPost,
    deletePost,
    addFavorite,
    removeFavorite,
    upvotePost,
    unvotePost,
    addHidden,
    removeHidden,

    // Comment
    addComment,
    upvoteComment,
    unvoteComment,
    addFavoriteComment,

    // User
    updateUser,
    changePw,

    // Authentication
    login,
    register,
    logout,
  },
};
