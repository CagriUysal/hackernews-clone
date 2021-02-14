import React, { FunctionComponent } from "react";
import { css } from "@emotion/react";
import {
  subDays,
  subMonths,
  subYears,
  addDays,
  addMonths,
  addYears,
  format,
} from "date-fns";

const styles = {
  button: (theme) => css`
    background: none;
    border: none;
    &:hover {
      cursor: pointer;
    }
    font-size: 1em;
    color: ${theme.colors.primary};
    text-decoration: underline;
    display: inline-block;
    padding: 0;
  `,
};

export enum Types {
  DAY_BEFORE,
  MONTH_BEFORE,
  YEAR_BEFORE,
  DAY_AFTER,
  MONTH_AFTER,
  YEAR_AFTER,
}

export const reducer = (state: Date, action: { type: Types }): Date => {
  const { type } = action;

  if (type === Types.DAY_BEFORE) {
    return subDays(state, 1);
  }

  if (type === Types.MONTH_BEFORE) {
    return subMonths(state, 1);
  }

  if (type === Types.YEAR_BEFORE) {
    return subYears(state, 1);
  }

  if (type === Types.DAY_AFTER) {
    return addDays(state, 1);
  }

  if (type === Types.MONTH_AFTER) {
    return addMonths(state, 1);
  }

  if (type === Types.YEAR_AFTER) {
    return addYears(state, 1);
  }

  return state;
};

type PropTypes = {
  targetDate: Date;
  dispatch: React.Dispatch<{
    type: Types;
  }>;
};

const PastTimeSelector: FunctionComponent<PropTypes> = ({
  targetDate,
  dispatch,
}) => {
  const FOUNDING_DAY = new Date("2007-02-19"); // The day hackernews founded. No posts before that day.
  const TODAY = new Date();

  const subDayValid = subDays(targetDate, 1) >= FOUNDING_DAY;
  const subMonthValid = subMonths(targetDate, 1) >= FOUNDING_DAY;
  const subYearValid = subYears(targetDate, 1) >= FOUNDING_DAY;
  const subValidArr = [subDayValid, subMonthValid, subYearValid].filter(
    (isValid) => isValid
  );

  const addDayValid = addDays(targetDate, 1) <= TODAY;
  const addMonthValid = addMonths(targetDate, 1) <= TODAY;
  const addYearValid = addYears(targetDate, 1) <= TODAY;
  const addValidArr = [addDayValid, addMonthValid, addYearValid].filter(
    (isValid) => isValid
  );

  return (
    <>
      <p
        css={css`
          margin-bottom: 0.5em;
        `}
      >
        Stories from {format(targetDate, "MMMM d, yyyy")}
      </p>
      <p>
        {subDayValid && (
          <>
            <span>Go back a </span>
            <button
              css={styles.button}
              onClick={() => dispatch({ type: Types.DAY_BEFORE })}
            >
              day
            </button>
          </>
        )}
        {subMonthValid && (
          <>
            <span>{subValidArr.length === 3 ? ", " : " or"}</span>
            <button
              css={styles.button}
              onClick={() => dispatch({ type: Types.MONTH_BEFORE })}
            >
              month
            </button>
          </>
        )}
        {subYearValid && (
          <>
            <span> or </span>
            <button
              css={styles.button}
              onClick={() => dispatch({ type: Types.YEAR_BEFORE })}
            >
              year
            </button>
          </>
        )}
        {subValidArr.length !== 0 && <span>. </span>}
        {addDayValid && (
          <>
            <span>Go forward a </span>
            <button
              css={styles.button}
              onClick={() => dispatch({ type: Types.DAY_AFTER })}
            >
              day
            </button>
          </>
        )}
        {addMonthValid && (
          <>
            <span>{addValidArr.length === 3 ? ", " : " or "}</span>
            <button
              css={styles.button}
              onClick={() => dispatch({ type: Types.MONTH_AFTER })}
            >
              month
            </button>
          </>
        )}
        {addYearValid && (
          <>
            <span> or </span>
            <button
              css={styles.button}
              onClick={() => dispatch({ type: Types.YEAR_AFTER })}
            >
              year
            </button>
          </>
        )}
        {addValidArr.length !== 0 && <span>.</span>}
      </p>
    </>
  );
};

export default PastTimeSelector;
