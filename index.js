const envPath =
  process.env.NODE_ENV === "development"
    ? ".env"
    : `.env.${process.env.NODE_ENV}`;
require("dotenv").config({ path: envPath });
const express = require("express");
const http = require("http");
const path = require("path");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");

const errorHandler = require("./src/middlewares/errorHandler");
const swaggerDocument = require("./openapi.json");
const PORT = 3000;
const app = express();
const server = http.createServer(app);
const swaggerSetup = [
  swaggerDocument,
  undefined,
  undefined,
  undefined,
  undefined,
  undefined,
  "Car Rental API"
];

require("./src/helpers/errors");

app.use(cors());
app.use(express.json());

app.use("/public", express.static(path.resolve(__dirname, "public")));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(...swaggerSetup));

require("./src/routes")(app);

app.use((req, res) => {
  res.status(404).send("Sorry, page not found!");
});

app.use(errorHandler);

server.listen(PORT, () => {
  console.log(`Server running on port http://localhost:${PORT}`);
});

module.exports = server;
