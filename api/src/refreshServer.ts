import { verify } from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const express = require("express"); // eslint-disable-line
const cookieParser = require("cookie-parser"); //eslint-disable-line

import { createAccessToken, createRefreshToken } from "./auth";

require("dotenv").config(); // eslint-disable-line

const prisma = new PrismaClient();

const app = express();
const PORT = 3000;

(function refreshServer() {
  app.use(cookieParser());
  app.post("/refresh", async (req, res) => {
    const token = req.cookies[process.env.COOKIE_NAME];
    if (!token) {
      res.send({ ok: false, accessToken: "" });
    }

    try {
      const payload = verify(token, process.env.REFRESH_TOKEN);

      const { userName, tokenVersion } = payload as any;
      const user = await prisma.user.findUnique({ where: { name: userName } });

      if (!user) {
        res.send({ ok: false, accessToken: "" });
      }

      if (tokenVersion !== user.tokenVersion) {
        res.send({ ok: false, accessToken: "" });
      }

      // update refresh token, so
      // user can logged in if they are using the site continuously
      res.cookie(
        process.env.COOKIE_NAME,
        await createRefreshToken(userName, tokenVersion + 1, prisma),
        {
          httpOnly: true,
        }
      );

      const accessToken = createAccessToken(userName);

      res.send({ ok: true, accessToken });
    } catch (error) {
      console.log(error);
      res.send({ ok: false, accessToken: "" });
    }
  });

  app.listen(PORT, () => {
    console.log(`Refresh server running at ${PORT}`);
  });
})();
