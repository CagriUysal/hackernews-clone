import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import { verify } from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

import { createAccessToken, createRefreshToken } from "./auth";
import sendRefreshToken from "./utils/sendRefreshToken";

dotenv.config();

const prisma = new PrismaClient();

const app = express();
const PORT = 3000;

(function refreshServer() {
  app.use(
    cors({
      origin: process.env.CLIENT_URL,
      credentials: true,
    })
  );
  app.use(cookieParser());

  app.post("/refresh", async (req, res) => {
    const token = req.cookies[process.env.COOKIE_NAME];

    if (!token) {
      res.send({ ok: false, accessToken: "" });
      return;
    }

    try {
      const payload = verify(token, process.env.REFRESH_TOKEN_SECRET);

      const { userName, tokenVersion } = payload as any;
      const user = await prisma.user.findUnique({ where: { name: userName } });

      if (!user) {
        res.send({ ok: false, accessToken: "" });
        return;
      }

      if (tokenVersion !== user.tokenVersion) {
        res.send({ ok: false, accessToken: "" });
        return;
      }

      // update refresh token
      // user can stay logged in if they are using the site continuously
      sendRefreshToken(
        res,
        await createRefreshToken(userName, tokenVersion + 1, prisma)
      );

      const accessToken = createAccessToken(userName);

      res.send({ ok: true, accessToken });
    } catch (error) {
      res.send({ ok: false, accessToken: "" });
    }
  });

  app.listen(PORT, () => {
    console.log(`Refresh server running at ${PORT}`);
  });
})();
