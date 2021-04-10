import React, { FunctionComponent } from "react";
import { RouteComponentProps } from "@reach/router";
import { useTheme } from "@emotion/react";

import Header from "../components/Header";

const Ask: FunctionComponent<RouteComponentProps> = () => {
  const theme = useTheme();

  return (
    <div css={theme.layout}>
      <Header />
      {/* TODO: Implement ASK page */}
    </div>
  );
};

export default Ask;
