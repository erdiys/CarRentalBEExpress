const Joi = require("joi");

const BaseController = require("../base");
const OrderModel = require("../../models/orders");
const express = require("express");
const router = express.Router();

const orders = new OrderModel();

const orderSchema = Joi.object({
  car_id: Joi.string().required(),
  user_id: Joi.string().required(),
  payment_id: Joi.string(),
  status: Joi.string().required(),
  orderNumber: Joi.string().required(),
  paymentReceipt: Joi.string(),
  total: Joi.number().required(),
  isDriver: Joi.boolean().allow(null),
  startTime: Joi.any().allow(null),
  finishTime: Joi.any().allow(null),
  createBy: Joi.string().allow(null),
  updateBy: Joi.string().allow(null)
});

class OrdersController extends BaseController {
    constructor(model) {
      super(model);
      router.get("/", this.getAll);
      router.post("/", this.validation(orderSchema), this.create);
      router.get("/:id", this.get);
      router.put("/:id", this.validation(orderSchema), this.update);
      router.delete("/:id", this.delete);
    }
  }
  
  new OrdersController(orders);
  
  module.exports = router;
  