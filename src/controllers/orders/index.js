const Joi = require("joi");

const BaseController = require("../base");
const OrderModel = require("../../models/orders");
const CarModel = require("../../models/cars");
const createInvoice = require("../../helpers/createInvoice");
const express = require("express");
const { authorize } = require("../../middlewares/authorization");
const router = express.Router();

const orders = new OrderModel();
const carModel = new CarModel();

// eslint-disable-next-line no-unused-vars
const orderUpdateSchema = Joi.object({
  car_id: Joi.number().required(),
  user_id: Joi.number().required(),
  status: Joi.string().required(),
  orderNumber: Joi.string().required(),
  isDriver: Joi.boolean().allow(null),
  startTime: Joi.any().allow(null),
  finishTime: Joi.any().allow(null),
  createdBy: Joi.string().allow(null),
  updatedBy: Joi.string().allow(null)
});

const orderSchema = Joi.object({
  car_id: Joi.number().required(),
  isDriver: Joi.boolean().required(),
  startTime: Joi.string().required(),
  finishTime: Joi.string().required(),
  createdBy: Joi.string().allow(null),
  updatedBy: Joi.string().allow(null)
});
class OrdersController extends BaseController {
  constructor(model) {
    super(model);
    router.get("/", authorize, this.getAll);
    router.post("/", this.validation(orderSchema), authorize, this.genOrder);
    router.get("/:id", authorize, this.getIDwUser);
    router.get("/:id/invoice", authorize, this.downloadInvoice);
    router.put("/:id/payment", authorize, this.payment);
    // router.put(
    //   "/:id",
    //   this.validation(orderUpdateSchema),
    //   authorize,
    //   this.update
    // );
    router.delete("/:id", authorize, this.delOrder);
  }

  genOrder = async (req, res, next) => {
    const { car_id, startTime, finishTime, isDriver } = req.body;
    const { user } = req;

    const orderTime = new Date(finishTime) - new Date(startTime);
    const orderDay = orderTime / (1000 * 3600 * 24);
    const orderDate = `${new Date().getFullYear()}-${
      new Date().getMonth() + 1
    }-${new Date().getDate()}`;

    try {
      const car = await carModel.getOne({
        where: {
          AND: [{ id: car_id }, { isAvailable: true }]
        }
      });

      if (!car) {
        // eslint-disable-next-line no-undef
        return next(new ValidationError("Car not found or is not available!"));
      }

      const getLastOrderToday = await this.model.count({
        createdDt: {
          lte: new Date()
        }
      });

      const orderPrice = car.price * orderDay;
      const orderNumber = `INV/${orderDate}/${user.id}${car.id}/${
        getLastOrderToday + 1
      }`;

      // eslint-disable-next-line no-unused-vars
      const [result, carUpdate] = await this.model.transaction([
        this.model.set({
          orderNumber: orderNumber,
          startTime,
          finishTime,
          isDriver,
          status: "pending",
          isExpired: false,
          createdBy: user.name === null ? user.email : user.name,
          updatedBy: user.name === null ? user.email : user.name,
          total: orderPrice,
          cars: {
            connect: {
              id: car_id
            }
          },
          users: {
            connect: {
              id: user.id
            }
          }
        }),
        carModel.update(car_id, { isAvailable: false })
      ]);

      return res.status(200).json(
        this.apiSend({
          code: 200,
          message: "Order created successfully",
          data: result
        })
      );
    } catch (error) {
      // eslint-disable-next-line no-undef
      next(new ServerError(error));
    }
  };

  delOrder = async (req, res, next) => {
    const { id } = req.params;
    try {
      const order = await this.model.getById(id, {
        include: {
          cars: {
            select: { name: true, manufacturer: true, licenseNumber: true }
          },
          users: {
            select: {
              name: true,
              email: true,
              phoneNumber: true,
              address: true
            }
          }
        }
      });

      if (!order) {
        // eslint-disable-next-line no-undef
        return next(new NotFoundError(null, `Order with id=${id} not found`));
      }
      if (order.status === "cancel") {
        // eslint-disable-next-line no-undef
        return next(new ValidationError("Order already canceled!"));
      }

      // eslint-disable-next-line no-unused-vars
      const [orderUpdate, carUpdate] = await this.model.transaction([
        this.model.update(id, {
          status: "cancel",
          isExpired: true,
          updatedBy:
            order.users.name === null ? order.users.email : order.users.name
        }),
        carModel.update(order.car_id, { isAvailable: true })
      ]);

      return res.status(200).json(
        this.apiSend({
          code: 200,
          message: "Order deleted successfully",
          data: orderUpdate
        })
      );
    } catch (error) {
      // eslint-disable-next-line no-undef
      next(new ServerError(error));
    }
  };

  getIDwUser = async (req, res, next) => {
    try {
      const { id } = req.params;
      const resource = await this.model.getById(id, {
        include: {
          cars: {
            select: { name: true, manufacturer: true, licenseNumber: true }
          },
          users: {
            select: {
              name: true,
              email: true,
              phoneNumber: true,
              address: true
            }
          }
        }
      });
      if (!resource) {
        // eslint-disable-next-line no-undef
        next(new NotFoundError(null, `Data with id=${id} not found`));
      }
      return res.status(200).json(
        this.apiSend({
          status: "success",
          message: "Data fetched successfully",
          data: resource
        })
      );
    } catch (err) {
      // eslint-disable-next-line no-undef
      next(new ServerError(err));
    }
  };

  payment = async (req, res, next) => {
    const { id } = req.params;
    try {
      const { payment } = req.body;
      const order = await this.model.getById(id);

      if (payment !== order.total) {
        // eslint-disable-next-line no-undef
        return next(new ValidationError("Payment not valid"));
      }

      const orderPaid = await this.model.update(id, {
        status: "paid",
      });

      return res.status(200).json(
        this.apiSend({
          code: 200,
          status: "success",
          message: "Order Paid successfully",
          data: orderPaid,
        })
      );
    } catch (error) {
      return next(error);
    }
  };
  
  downloadInvoice = async (req, res, next) => {
    const { id } = req.params;
    try {
      const order = await this.model.getById(id, {
        order_no: true,
        createdDt: true,
        status: true,
        user_id: true,
        start_time: true,
        end_time: true,
        total: true,
        cars: {
          select: {
            id: true,
            name: true,
            price: true,
          },
        },
        users:{
          select:{
            id: true,
            fullname: true,
            address: true
          }
        }
      });
      
      if (order.status !== "paid") {
        // eslint-disable-next-line no-undef
        return next(new ValidationError("Order not paid!"));
      }

      createInvoice(order, res);
    } catch (error) {
      return next(error);
    }
  }
}

new OrdersController(orders);

module.exports = router;
