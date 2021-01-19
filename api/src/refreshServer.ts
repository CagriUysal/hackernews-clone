import { verify } from "jsonwebtoken";

const express = require("express"); // eslint-disable-line
const cookieParser = require("cookie-parser"); //eslint-disable-line

import { createAccessToken, createRefreshToken } from "./auth";

require("dotenv").config(); // eslint-disable-line

const app = express();
const PORT = 3000;

(function refreshServer() {
  app.use(cookieParser());
  app.post("/refresh", (req, res) => {
    const token = req.cookies[process.env.COOKIE_NAME];
    if (!token) {
      res.send({ ok: false, accessToken: "" });
    }

    try {
      const payload = verify(token, process.env.REFRESH_TOKEN);
      console.log(payload);

      const { userName } = payload as any;
      const accessToken = createAccessToken(userName);

      // update refresh token, so
      // user can logged in if they are using the site continuously
      res.cookie(process.env.COOKIE_NAME, createRefreshToken(userName), {
        httpOnly: true,
      });

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
