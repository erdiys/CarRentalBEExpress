require("dotenv").config();
const express = require("express");
const http = require("http");
const routes = require("./src/routes/index");

const app = express();
const port = 3000;
const server = http.createServer(app);

app.use(express.json());
app.use(routes);

app.use((req, res) => res.status(404).send("Sorry, page not found!"));
server.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
