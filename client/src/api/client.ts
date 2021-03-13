import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  ApolloLink,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { TokenRefreshLink } from "apollo-link-token-refresh";
import jwtDecode, { JwtPayload } from "jwt-decode";

import { getAccessToken, setAccessToken } from "./accessToken";
import refreshAccessToken from "../utils/refreshAccessToken";

const httpLink = new HttpLink({
  uri: "http://localhost:4000",
  credentials: "include",
});

const refreshLink = new TokenRefreshLink({
  accessTokenField: "accessToken",
  isTokenValidOrUndefined: () => {
    const token = getAccessToken();

    if (token === "") {
      return true;
    }

    try {
      const { exp } = jwtDecode<JwtPayload>(token); // if invalid token, throws error

      if (Date.now() >= exp * 1000) {
        return false;
      } else {
        return true;
      }
    } catch {
      return false;
    }
  },
  fetchAccessToken: refreshAccessToken,
  handleFetch: (accessToken) => {
    setAccessToken(accessToken);
  },
});

const authLink = setContext((_, { headers }) => {
  const token = getAccessToken();
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: ApolloLink.from([refreshLink, authLink, httpLink]),
});

export default client;
