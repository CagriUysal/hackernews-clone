import { Response } from "express";

export default function sendRefreshToken(res: Response, token: string): void {
  res.cookie(process.env.COOKIE_NAME, token, {
    httpOnly: true,
    path: "/refresh",
  });
}
