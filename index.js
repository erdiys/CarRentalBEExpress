require("dotenv").config();
const express = require("express");
const http = require("http");
const path = require("path");

const errorHandler = require("./src/middlewares/errorHandler");
const PORT = 3000;
const app = express();
const server = http.createServer(app);

require("./src/helpers/errors");

app.use(express.json());

app.use("/public", express.static(path.resolve( __dirname, "public")));

require("./src/routes")(app);

app.use((req, res) => {
  res.status(404).send("Sorry, page not found!");
});

app.use(errorHandler);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
