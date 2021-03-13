import React, { FunctionComponent } from "react";
import { useQuery, gql } from "@apollo/client";
import { useTheme } from "@emotion/react";
import { RouteComponentProps } from "@reach/router";

import Header from "../components/Header";

const Home: FunctionComponent<RouteComponentProps> = () => {
  const theme = useTheme();

  return (
    <div css={theme.layout}>
      <Header />
    </div>
  );
};

export default Home;
