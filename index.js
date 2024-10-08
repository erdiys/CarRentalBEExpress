require("dotenv").config();
const express = require("express");
const http = require("http");
const PORT = 3000;

const app = express();
const server = http.createServer(app);
const errorHandler = require("./src/middlewares/errorHandler");

require("./src/helpers/errors");

app.use(express.json());

require("./src/routes")(app);

app.use((req, res) => {
  res.status(404).send("Sorry, page not found!");
});

app.use(errorHandler);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
