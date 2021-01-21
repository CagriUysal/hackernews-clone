let accessToken = "";

export const setAccessToken = (value: string): void => {
  accessToken = value;
};

export const getAccessToken = (): string => {
  return accessToken;
};
