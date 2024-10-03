const express = require("express");
const http = require("http");
const fs = require("fs");
const pg = require("pg");
const { Client } = pg;

const app = express();
const port = 3000;
const server = http.createServer(app);
const client = new Client({
  user: "postgres",
  host: "localhost",
  database: "car_rental",
  password: "toyota",
  port: 5432
});

client.connect((err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("connected to database");
  }
});

const getCars = () => {
  const cars = fs.readFileSync("cars.json", "utf-8");
  const carsParser = JSON.parse(cars);
  return carsParser;
};

app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).send("Hello World!");
});

app.get("/cars/database", async (req, res) => {
  const params = req.query;
  const data = await client.query(
    `SELECT * FROM cars ${params.id ? `WHERE id = ${params.id}` : ""}`
  );

  res.status(200).header("Content-Type", "application/json").send(data.rows);
  res.end();
});

app.put("/cars/database", async (req, res) => {
  const params = req.query;
  const body = req.body;
  const keysUpdate = Object.keys(body.update);
  const keysCond = Object.keys(body.condition);

  const update = keysUpdate.map((el) =>
    typeof body.update[el] == "boolean" || typeof body.update[el] == "number"
      ? `"${el}" = ${body.update[el]}`
      : `"${el}" = '${body.update[el]}'`
  );
  const where = keysCond.map((el) =>
    typeof body.condition[el] == "boolean" ||
    typeof body.condition[el] == "number"
      ? `"${el}" = ${body.condition[el]}`
      : `"${el}" = '${body.condition[el]}'`
  );

  const query = `UPDATE cars SET ${update.join(
    ", "
  )}, "updateAt" = now(), "updateBy" = 'Admin' WHERE ${where.join(" AND ")}`;

  console.log(query);

  try {
    const data = await client.query(query);
    res.status(200).send(`${data.rowCount} rows affected`);
  } catch (err) {
    res.status(501).send(`Inteernal Server Error: ${err}`);
  }
  res.end();
});

app.post("/cars/database", async (req, res) => {
  const params = req.query;
  const body = req.body;
  const keysInsert = Object.keys(body);
  const valueInsert = Object.values(body);

  const query = `INSERT INTO cars (${keysInsert
    .map((el) => `"${el}"`)
    .join(", ")}, "createBy") VALUES (${valueInsert
    .map((el) =>
      typeof el == "boolean" || typeof el == "number" ? el : `'${el}'`
    )
    .join(", ")}, 'Admin')`;

  console.log(query);

  try {
    const data = await client.query(query);
    res.status(200).send(`${data.rowCount} rows affected`);
  } catch (err) {
    res.status(501).send(`Inteernal Server Error: ${err}`);
  }
  res.end();
});

app.post("/cars", (req, res) => {
  const newCar = req.body;
  const carsParser = getCars();
  carsParser.cars.push(newCar);
  fs.writeFileSync("cars.json", JSON.stringify(carsParser));
  res.status(200).send("Car added!");
  res.end();
});

server.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
