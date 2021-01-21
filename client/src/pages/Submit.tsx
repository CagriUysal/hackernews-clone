import React from "react";

import { gql, useQuery } from "@apollo/client";

import Header from "../components/Header";

const BYE = gql`
  query BYE {
    bye {
      message
      success
      code
    }
  }
`;

const Submit: React.FunctionComponent = () => {
  const { data, loading } = useQuery(BYE, { fetchPolicy: "network-only" });

  if (loading) {
    return <h1>loading...</h1>;
  }

  if (data) {
    return (
      <>
        <Header />
        <h1>{data.bye.message}</h1>
      </>
    );
  }

  return <Header />;
};

export default Submit;
