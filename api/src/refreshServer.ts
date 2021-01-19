const express = require("express"); // eslint-disable-line
const cookieParser = require("cookie-parser"); //eslint-disable-line

const app = express();
const PORT = 3000;

(function refreshServer() {
  app.use(cookieParser());
  app.post("/refresh", (req, res) => {
    console.log(req.cookies);
    res.send("alright");
  });

  app.listen(PORT, () => {
    console.log(`Refresh server running at ${PORT}`);
  });
})();
