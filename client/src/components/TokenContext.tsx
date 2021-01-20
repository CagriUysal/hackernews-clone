import React, { createContext, FunctionComponent, useReducer } from "react";

const initState = "";

export const TokenContext = createContext({});

export const CHANGE_TOKEN = "CHANGE_TOKEN";
export const DELETE_TOKEN = "DELETE_TOKEN";

const reducer = (state, action) => {
  if (action.type === CHANGE_TOKEN) {
    const { token: newToken } = action.payload;

    return newToken;
  }

  if (action.type === DELETE_TOKEN) {
    return "";
  }

  return state;
};

export const TokenProvider: FunctionComponent = ({ children }) => {
  const [token, dispatch] = useReducer(reducer, initState);

  return (
    <TokenContext.Provider value={{ token, dispatch }}>
      {children}
    </TokenContext.Provider>
  );
};
