import React, { FunctionComponent } from "react";
import { useQuery } from "@apollo/client";

import { ME } from "./queries";

export const MeContext = React.createContext({});

const MeContextProvider: FunctionComponent = ({ children }) => {
  const { data, refetch } = useQuery(ME, {
    fetchPolicy: "network-only",
  });

  return (
    <MeContext.Provider
      value={{ me: data?.me?.name ? data.me.name : null, refetch }}
    >
      {children}
    </MeContext.Provider>
  );
};

export default MeContextProvider;
