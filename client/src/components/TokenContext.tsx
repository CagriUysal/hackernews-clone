import React, { createContext, FunctionComponent, useReducer } from "react";

const initState = "";

export const TokenContext = createContext<ITokenContext>({
  accessToken: "",
  dispatch: () => "",
});

export const CHANGE_TOKEN = "CHANGE_TOKEN";
export const DELETE_TOKEN = "DELETE_TOKEN";

const reducer = (state: string, action: IAction): string => {
  if (action.type === CHANGE_TOKEN) {
    const { accessToken: newToken } = action.payload;

    return newToken;
  }

  if (action.type === DELETE_TOKEN) {
    return "";
  }

  return state;
};

export const TokenProvider: FunctionComponent = ({ children }) => {
  const [accessToken, dispatch] = useReducer(reducer, initState);

  return (
    <TokenContext.Provider value={{ accessToken, dispatch }}>
      {children}
    </TokenContext.Provider>
  );
};

interface IAction {
  payload: { accessToken: string };
  type: actionTypes;
}

interface ITokenContext {
  accessToken: string;
  dispatch: React.Dispatch<IAction>;
}

type actionTypes = "CHANGE_TOKEN" | "DELETE_TOKEN";
