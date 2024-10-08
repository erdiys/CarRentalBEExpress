const Joi = require("joi");

const BaseController = require("../base");
const CarModel = require("../../models/cars");
const express = require("express");
const { authorize, checkRole } = require("../../middlewares/authorization");
const router = express.Router();

const cars = new CarModel();

const carSchema = Joi.object({
  name: Joi.string().required(),
  price: Joi.number().required(),
  manufacturer: Joi.string().required(),
  isDriver: Joi.boolean().required(),
  img: Joi.string().uri().allow(null),
  description: Joi.string().allow(null),
  isAvailable: Joi.boolean(),
  licenseNumber: Joi.string(),
  seat: Joi.number().min(2),
  baggage: Joi.number(),
  transmission: Joi.string(),
  year: Joi.string(),
  createBy: Joi.string().allow(null),
  updateBy: Joi.string().allow(null)
});

class CarsController extends BaseController {
  constructor(model) {
    super(model);
    router.get("/", this.getAll);
    router.post(
      "/",
      this.validation(carSchema),
      authorize,
      checkRole(['Admin']),
      this.create
    );
    router.get("/:id", this.get);
    router.put("/:id", this.validation(carSchema), authorize, this.update);
    router.delete("/:id", authorize, authorize, this.delete);
  }
}

new CarsController(cars);

module.exports = router;
