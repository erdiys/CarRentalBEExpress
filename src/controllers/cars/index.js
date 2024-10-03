const pool = require("../../config/db");

class Cars {
  async getCars(req, res) {
    try {
      const cars = await pool.query(
        `SELECT "id", "name", "year", "manufacturer", "price", "img" FROM cars`
      );
      res.status(200).json(cars.rows);
    } catch (error) {
      console.log(error);
      res.status(500).send("Internal Server Error!");
    }
  }

  async getCarById(req, res) {
    const { id } = req.params;
    try {
      const cars = await pool.query(`SELECT * FROM cars WHERE "id" = ${id}`);
      if (cars.rowCount === 0) {
        res.status(404).send(`Cars with id ${id} not found!`);
      } else {
        res.status(200).json(cars.rows);
      }
    } catch (error) {
      console.log(error);
      res.status(500).send("Internal Server Error!");
    }
  }

  async createCars(req, res) {
    const body = req.body;
    const keysInsert = Object.keys(body);
    const valueInsert = Object.values(body);

    const query = `INSERT INTO cars (${keysInsert
      .map((el) => `"${el}"`)
      .join(", ")}, "createBy") VALUES (${valueInsert
      .map((el) =>
        typeof el == "boolean" || typeof el == "number" ? el : `'${el}'`
      )
      .join(", ")}, 'Admin') RETURNING *`;

    try {
      const cars = await pool.query(query);
      res
        .status(200)
        .send(
          `${cars.rowCount} rows affected\n${cars.rows.map((el) =>
            JSON.stringify(el)
          )}`
        );
    } catch (error) {
      console.log(error);
      res.status(501).send(`Inteernal Server Error`);
    }
  }

  async updateCar(req, res) {
    const { id } = req.params;
    const body = req.body;
    const keysUpdate = Object.keys(body.update);
    const keysCond = body.condition ? Object.keys(body.condition) : [];

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
    )}, "updateAt" = now(), "updateBy" = 'Admin' WHERE "id" = ${id} ${
      where.length !== 0 ? "AND " + where.join(" AND ") : ""
    } RETURNING *`;

    console.log(query);

    try {
      const cars = await pool.query(query);
      res
        .status(200)
        .send(
          `${cars.rowCount} rows affected\n${cars.rows.map((el) =>
            JSON.stringify(el)
          )}`
        );
    } catch (error) {
      console.log(error);
      res.status(501).send(`Inteernal Server Error`);
    }
  }

  async deleteCar(req, res) {
    const { id } = req.params;
    try {
      const cars = await pool.query(
        `DELETE FROM cars WHERE "id" = ${id} RETURNING *`
      );
      if (cars.rowCount === 0) {
        res.status(404).send(`Cars with id ${id} not found!`);
      } else {
        res
          .status(200)
          .send(
            `${cars.rowCount} rows affected\n${cars.rows.map((el) =>
              JSON.stringify(el)
            )}`
          );
      }
    } catch (error) {
      console.log(error);
      res.status(501).send(`Inteernal Server Error`);
    }
  }
}

module.exports = new Cars();
