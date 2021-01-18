const jwt = require("jsonwebtoken"); //eslint-disable-line

export const createAccessToken = (userName: string): string => {
  return jwt.sign({ userName }, process.env.ACCESS_TOKEN, { expiresIn: "15m" });
};

export const createRefreshToken = (userName: string): string => {
  return jwt.sign({ userName }, process.env.REFRESH_TOKEN, { expiresIn: "7d" });
};
