import { css } from "@emotion/react";

export const theme = {
  colors: {
    primary: "#828282",
    bg: "#f6f6ef",
  },
  layout: css`
    width: 85%;
    margin: 0 auto;
    background-color: #f6f6ef;
    padding-bottom: 3em;

    @media (max-width: 750px) {
      width: 100%;
      margin: 0;
    }
  `,
  pageButton: css`
    color: #000;
    margin-left: 3.3rem;
    margin-top: 1rem;
  `,
};
