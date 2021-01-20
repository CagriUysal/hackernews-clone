import React, { useContext, useEffect } from "react";

import { gql, useQuery } from "@apollo/client";

import Header from "../components/Header";
import { TokenContext } from "../components/TokenContext";

const BYE = gql`
  query BYE {
    bye {
      message
      success
      code
    }
  }
`;

const Submit = (): React.ReactElement => {
  const { accessToken } = useContext(TokenContext);

  const { data, refetch } = useQuery(BYE, {
    context: {
      headers: {
        authorization: `beaber ${accessToken}`,
      },
    },
  });

  useEffect(() => {
    refetch();
  }, [accessToken]);

  if (data) {
    return <h1>{data.bye.message}</h1>;
  }

  return <Header />;
};

export default Submit;
