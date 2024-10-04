/* eslint-disable no-unused-vars */
const pool = require("../../config/db");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const spreadData = (keys, values) => {
  const newData = {};
  keys.map((key, idx) => {
    newData[key] = values[idx];
  });
  return newData;
};

class Cars {
  async getCars(req, res) {
    try {
      const cars = await prisma.cars.findMany({
        orderBy: { id: "asc" },
        select: {
          id: true,
          name: true,
          year: true,
          manufacturer: true,
          price: true,
          img: true,
          baggage: true,
          seat: true,
          description: true
        }
      });

      if (cars.length === 0) {
        res.status(404).send("Cars not found!");
      } else {
        res.status(200).json(cars);
      }
    } catch (error) {
      console.log(error);
      res.status(500).send("Internal Server Error!");
    }
  }

  async getCarById(req, res) {
    const { id } = req.params;
    try {
      const cars = await prisma.cars.findUnique({
        where: {
          id: Number(id)
        }
      });
      if (cars) {
        res.status(200).json(cars);
      } else {
        res.status(404).send(`Cars with id ${id} not found!`);
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

    try {
      const cars = await prisma.cars.create({
        data: { ...spreadData(keysInsert, valueInsert), createBy: "Admin" }
      });
      res.status(200).send(`Data inserted:\n${JSON.stringify(cars)}`);
    } catch (error) {
      console.log(error);
      res.status(501).send(`Inteernal Server Error`);
    }
  }

  async updateCar(req, res) {
    const { id } = req.params;
    const body = req.body;
    const keysUpdate = Object.keys(body.update);
    const valuesUpdate = Object.values(body.update);
    const keysCond = body.condition ? Object.keys(body.condition) : [];
    const valuesCond = body.condition ? Object.values(body.condition) : [];

    const where = {
      ...spreadData(keysCond, valuesCond),
      id: Number(id)
    };

    try {
      const cars = await prisma.cars.update({
        where: where,
        data: {
          ...spreadData(keysUpdate, valuesUpdate),
          updateAt: new Date(),
          updateBy: "Admin"
        }
      });
      res.status(200).send(`Data updated:\n${JSON.stringify(cars)}`);
    } catch (error) {
      console.log(error);
      res.status(501).send(`Inteernal Server Error`);
    }
  }

  async deleteCar(req, res) {
    const { id } = req.params;
    try {
      const cars = await prisma.cars.delete({
        where: {
          id: Number(id)
        }
      });

      if (cars) {
        res.status(200).send(`Data deleted:\n${JSON.stringify(cars)}`);
      } else {
        res.status(404).send(`Cars with id ${id} not found!`);
      }
    } catch (error) {
      const {
        code,
        meta: { modelName, cause }
      } = error;
      if (code === "P2025") {
        res.status(404).send(`Cars with id ${id} not found!`);
      } else {
        res.status(501).send(`Inteernal Server Error`);
      }
    }
  }
}

module.exports = new Cars();
