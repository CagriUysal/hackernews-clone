import React, { FunctionComponent, useReducer } from "react";
import { Link, RouteComponentProps } from "@reach/router";
import { useTheme, css } from "@emotion/react";
import { useQuery } from "@apollo/client";
import { subDays, addDays, format } from "date-fns";

import Header from "../components/Header";
import PostList from "../components/PostList";
import PastTimeSelector, { reducer } from "../components/PastTimeSelector";
import { PAST_POSTS } from "../api/queries";
import { ITEM_PER_PAGE } from "../../../common/constants";

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

interface IProps extends RouteComponentProps {
  page?: string;
}

const Past: FunctionComponent<IProps> = ({ page }) => {
  const _page = page ? Number(page) : undefined;

  const theme = useTheme();
  const [targetDate, dispatch] = useReducer(reducer, subDays(new Date(), 1)); // default past date is yesterday.
  const { data, refetch } = useQuery(PAST_POSTS, {
    variables: {
      input: {
        start: format(targetDate, "yyyy-MM-dd"),
        end: format(addDays(targetDate, 1), "yyyy-MM-dd"),
      },
      page: _page,
    },
  });

  if (data) {
    const { pastPosts } = data;

    return (
      <div css={theme.layout}>
        <div css={styles.container}>
          <Header />

          <div css={styles.selector}>
            <PastTimeSelector targetDate={targetDate} dispatch={dispatch} />
          </div>

          {data && (
            <PostList
              posts={pastPosts}
              refetch={refetch}
              showFavorite={false}
            />
          )}

          {pastPosts.length === ITEM_PER_PAGE && (
            <div css={theme.pageButton}>
              <Link to={`/front/${_page ? _page + 1 : 2}`}>More</Link>
            </div>
          )}
        </div>
      </div>
    );
  } else {
    return null;
  }
};

export default Past;
