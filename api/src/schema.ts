import { gql } from "apollo-server";

export const typeDefs = gql`
  """
  Interfaces
  """
  interface Response {
    code: String!
    success: Boolean!
    message: String!
  }

  interface User {
    id: Int!
    name: String!
    about: String!
    createdAt: Float!
    karma: Int!
    posts: [Post!]!
    comments: [Comment!]!
    favorites: [Post!]!
  }

  """
  Post
  """
  type Post {
    id: Int!
    link: String!
    domain: String!
    title: String!
    upvote: Int!
    createdAt: Float!
    author: PublicUser!
    comments: [Comment!]
    currentUserFavorited: Boolean
    currentUserUpvoted: Boolean
    currentUserHide: Boolean
  }

  type upvotedPostsResponse implements Response {
    code: String!
    success: Boolean!
    message: String!
    upvotes: [Post!]
  }

  type hiddenPostsResponse implements Response {
    code: String!
    success: Boolean!
    message: String!
    hidden: [Post!]
  }

  input AddPostInput {
    link: String!
    title: String!
  }

  input pastPostsInput {
    start: String!
    end: String!
  }

  """
  Comment
  """
  type Comment {
    id: Int!
    message: String!
    upvotes: Int!
    createdAt: Float!
    post: Post!
    author: PublicUser!
    parent: Comment
  }

  input AddCommentInput {
    message: String!
    postId: Int!
    parentId: Int
  }

  type AddCommentResponse implements Response {
    code: String!
    success: Boolean!
    message: String!
    comment: Comment
  }

  """
  User
  """
  type PrivateUser implements User {
    id: Int!
    name: String!
    about: String!
    createdAt: Float!
    karma: Int!
    posts: [Post!]!
    comments: [Comment!]!
    favorites: [Post!]!

    email: String
    hidden: [Post!]!
    upvotedPosts: [Post!]!
  }

  type PublicUser implements User {
    id: Int!
    name: String!
    about: String!
    createdAt: Float!
    karma: Int!
    posts: [Post!]!
    comments: [Comment!]!
    favorites: [Post!]!
  }

  input RegisterInput {
    name: String!
    password: String!
  }

  input UpdateUserInput {
    about: String!
    email: String!
  }

  type UpdateUserResponse implements Response {
    code: String!
    success: Boolean!
    message: String!
    user: PrivateUser
  }

  input ChangePwInput {
    currentPw: String!
    newPw: String!
  }

  input LoginInput {
    name: String!
    password: String!
  }

  type LoginResponse implements Response {
    code: String!
    success: Boolean!
    message: String!
    accessToken: String
  }

  """
  Queries
  """
  type Query {
    posts: [Post!]!
    post(id: Int!): Post
    domainPosts(domain: String!): [Post!]!
    latestPosts: [Post!]!
    pastPosts(input: pastPostsInput!): [Post!]!
    userPosts(name: String!): [Post!]
    favoritePosts(name: String!): [Post!]
    upvotedPosts(name: String!): upvotedPostsResponse!
    hiddenPosts(name: String!): hiddenPostsResponse!
    postComments(postId: Int!): [Comment!]!
    comments: [Comment!]!
    comment(id: Int!): Comment
    userComments(name: String!): [Comment!]
    user(name: String!): User
    me: PrivateUser
  }

  """
  Mutations
  """
  type Mutation {
    addPost(post: AddPostInput!): MutationResponse!
    deletePost(postId: Int!): MutationResponse!
    addComment(comment: AddCommentInput!): AddCommentResponse!
    addFavorite(postId: Int!): MutationResponse!
    removeFavorite(postId: Int!): MutationResponse!
    upvotePost(postId: Int!): MutationResponse!
    unvotePost(postId: Int!): MutationResponse!
    addHidden(postId: Int!): MutationResponse!
    removeHidden(postId: Int!): MutationResponse!
    register(user: RegisterInput!): MutationResponse!
    updateUser(input: UpdateUserInput!): UpdateUserResponse!
    changePw(input: ChangePwInput!): MutationResponse!
    login(user: LoginInput!): LoginResponse!
    logout: Boolean!
  }

  type MutationResponse implements Response {
    code: String!
    success: Boolean!
    message: String!
  }
`;
