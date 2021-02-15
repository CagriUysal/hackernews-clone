import React, { FunctionComponent, useState } from "react";
import { css, useTheme } from "@emotion/react";
import { RouteComponentProps } from "@reach/router";

import Header from "../components/Header";

const styles = {
  container: (theme) =>
    css`
      background-color: ${theme.colors.bg};
    `,
};

interface ComponentProps extends RouteComponentProps {
  userName?: string;
}

const User: FunctionComponent<ComponentProps> = ({ userName }) => {
  const theme = useTheme();

  return (
    <div css={theme.layout}>
      <Header />
      <div css={styles.container}></div>
    </div>
  );
};

export default User;
