import React, { FunctionComponent } from "react";
import { RouteComponentProps } from "@reach/router";
import { useTheme } from "@emotion/react";

import Header from "../components/Header";

const Show: FunctionComponent<RouteComponentProps> = () => {
  const theme = useTheme();

  return (
    <div css={theme.layout}>
      <Header />
      {/* TODO: Implement SHOW page */}
    </div>
  );
};

export default Show;
