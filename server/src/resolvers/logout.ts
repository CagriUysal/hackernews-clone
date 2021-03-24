import sendRefreshToken from "../utils/sendRefreshToken";

export default function (_, __, { isAuth, res }): boolean {
  try {
    isAuth();

    // clear refresh token cookie
    sendRefreshToken(res, "");

    return true;
  } catch {
    return false;
  }
}
