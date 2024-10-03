/* eslint-disable no-unused-vars */
const pg = require("pg");
const { Pool } = pg;

const { PG_USER, PG_PASSWORD, PG_DATABASE, PG_HOST, PG_PORT } = process.env;

const pool = new Pool({
  user: PG_USER,
  host: PG_HOST,
  database: PG_DATABASE,
  password: PG_PASSWORD,
  port: PG_PORT
});

pool.on("error", (err, client) => {
  console.log("Unexpected error on idle client", err);
  process.exit(-1);
});

pool.connect((err, connection) => {
  if (err) throw err;
  console.log("Connected to database");
  connection.release();
});

module.exports = pool;
