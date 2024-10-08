const Joi = require("joi");

const BaseController = require("../base");
const UserModel = require("../../models/users");
const express = require("express");
const { encryptPassword } = require("../../helpers/bcrypt");
const router = express.Router();

const users = new UserModel();

const userSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().required(),
  password: Joi.string().required(),
  address: Joi.string().required(),
  phoneNumber: Joi.string().required(),
  role: Joi.string().required(),
  avatar: Joi.string().uri().allow(null),
  driverLicense: Joi.string().allow(null),
  birthdate: Joi.string(),
  createBy: Joi.string().allow(null),
  updateBy: Joi.string().allow(null)
});

class UsersController extends BaseController {
  constructor(model) {
    super(model);
    router.get("/", this.getAll);
    router.post(
      "/",
      [this.validation(userSchema), this.checkUnique, this.encrypt],
      this.create
    );
    router.get("/:id", this.get);
    router.put(
      "/:id",
      [this.validation(userSchema), this.checkUnique, this.encrypt],
      this.update
    );
    router.delete("/:id", this.delete);
  }

  checkUnique = async (req, res, next) => {
    const { email, phoneNumber } = req.body;
    const user = await this.model.getOne({
      where: { OR: [{ email }, { phoneNumber }] },
      select: {
        email: true,
        phoneNumber: true
      }
    });

    if (user) {
      // eslint-disable-next-line no-undef
      return next(new ValidationError("Email or phone number already exists"));
    }
    next();
  };

  encrypt = async (req, res, next) => {
    req.body.password = await encryptPassword(req.body.password);
    next();
  }
}

new UsersController(users);

module.exports = router;
