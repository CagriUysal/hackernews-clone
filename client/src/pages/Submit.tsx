import React from "react";

import { gql, useQuery } from "@apollo/client";

import Header from "../components/Header";

const ME = gql`
  query Me {
    me {
      name
    }
  }
`;

const Submit: React.FunctionComponent = () => {
  const { data, loading } = useQuery(ME, { fetchPolicy: "network-only" });

  let body = null;

  if (loading) {
    body = null;
  } else if (data && data.me) {
    body = <div>{`you logged in as ${data.me.name}`}</div>;
  } else {
    body = <div>you are not logged in.</div>;
  }

  return (
    <>
      <Header />
      <h1>{body}</h1>
    </>
  );
};

export default Submit;
