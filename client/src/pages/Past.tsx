import React, { FunctionComponent, useReducer } from "react";
import { RouteComponentProps } from "@reach/router";
import { useTheme, css } from "@emotion/react";
import { useQuery } from "@apollo/client";
import { subDays, addDays, format } from "date-fns";

import Header from "../components/Header";
import PostList from "../components/PostList";
import PastTimeSelector, { reducer } from "../components/PastTimeSelector";
import { PAST_POSTS } from "../api/queries";

const styles = {
  selector: (theme) => css`
    font-size: 0.9em;
    margin: 1rem;
    margin-left: 3rem;
    color: ${theme.colors.primary};
  `,
  container: (theme) => css`
    background-color: ${theme.colors.bg};
  `,
};

const Past: FunctionComponent<RouteComponentProps> = () => {
  const theme = useTheme();
  const [targetDate, dispatch] = useReducer(reducer, subDays(new Date(), 1)); // default past date is yesterday.
  const { data, refetch } = useQuery(PAST_POSTS, {
    variables: {
      input: {
        start: format(targetDate, "yyyy-MM-dd"),
        end: format(addDays(targetDate, 1), "yyyy-MM-dd"),
      },
    },
  });

  return (
    <div css={theme.layout}>
      <div css={styles.container}>
        <Header />

        <div css={styles.selector}>
          <PastTimeSelector targetDate={targetDate} dispatch={dispatch} />
        </div>

        {data && (
          <PostList
            posts={data.pastPosts}
            refetch={refetch}
            showFavorite={false}
          />
        )}
      </div>
    </div>
  );
};

export default Past;
