import posts from "./resolvers/posts";
import me from "./resolvers/me";
import addPost from "./resolvers/addPost";
import login from "./resolvers/login";
import register from "./resolvers/register";
import logout from "./resolvers/logout";

export const resolvers = {
  Response: {
    __resolveType: (response): string => {
      if (response.post) return "Post";
      if (response.user) return "User";
    },
  },

  Query: {
    posts,
    me,
  },

  Mutation: {
    addPost,
    login,
    register,
    logout,
  },
};
