import React from "react";

import { gql, useQuery } from "@apollo/client";
import { Redirect } from "@reach/router";
import { css } from "@emotion/react";

import Header from "../components/Header";

const styles = {
  container: css`
    width: 85%;
    margin: 0 auto;
    background-color: #f6f6ef;
    color: #828282;
  `,
  formInput: css`
    margin-bottom: 0.5em;
  `,
  label: css`
    display: inline-block;
    // other elements will have (3 + 0.5)em margin-left to align with labels.
    margin-left: 0.5em;
    width: 3em;
  `,
  input: css`
    width: 40em;
  `,
  textContainer: css`
    margin-top: 0.5em;
    display: flex;
    align-items: center;
  `,
  button: css`
    font-size: 0.9rem;
    margin-left: 3.5rem;
    margin-top: 1rem;
  `,
  caution: css`
    font-size: 0.9rem;
    margin-left: 3.5rem;
    margin-top: 2rem;
    padding-bottom: 3rem;
  `,
};

const ME = gql`
  query Me {
    me {
      name
    }
  }
`;

const Submit: React.FunctionComponent = () => {
  const { data, loading } = useQuery(ME, { fetchPolicy: "network-only" });

  if (loading) {
    return null;
  } else if (data && data.me) {
    return (
      <>
        <Header />
        <div css={styles.container}>
          <div
            css={css`
              ${styles.formInput};
              padding-top: 1em;
            `}
          >
            <label htmlFor="title" css={styles.label}>
              title
            </label>
            <input type="text" name="title" id="title" css={styles.input} />
          </div>

          <div css={styles.formInput}>
            <label htmlFor="url" css={styles.label}>
              url
            </label>
            <input type="text" name="url" id="url" css={styles.input} />
          </div>

          <span
            css={css`
              font-weight: bold;
              margin-left: 3.5em;
            `}
          >
            or
          </span>

          <div css={styles.textContainer}>
            <label htmlFor="text" css={styles.label}>
              text
            </label>
            <textarea name="text" id="text" css={styles.input} rows={4} />
          </div>

          <button css={styles.button}>submit</button>

          <p css={styles.caution}>
            Leave url blank to submit a question for discussion. If there is no
            url, the text (if any) will appear at the top of the thread.
          </p>
        </div>
      </>
    );
  } else {
    return <Redirect to="/login" noThrow />;
  }
};

export default Submit;
