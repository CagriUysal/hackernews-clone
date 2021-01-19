const express = require("express"); // eslint-disable-line

const app = express();
const PORT = 3000;

app.get("/refresh", (req, res) => {
  res.send("test");
});

app.listen(PORT, () => {
  console.log(`Refresh server running at ${PORT}`);
});
