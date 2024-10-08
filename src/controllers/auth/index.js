const Joi = require("joi");
const express = require("express");

const BaseController = require("../base");
const UserModel = require("../../models/users");
const { checkPassword, encryptPassword } = require("../../helpers/bcrypt");
const { createToken } = require("../../helpers/jwt");
const router = express.Router();

const users = new UserModel();

const signupSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string()
    .min(6)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{6,})/)
    .messages({
      "string.pattern.base": `Must Contain 1 Uppercase, 1 Lowercase, 1 Number and 1 Special Character (ex. !@#$%^&*)`,
      "string.min": `Password length must be at least {#limit} characters long`
    })
    .required(),
  createBy: Joi.string().allow(null),
  updateBy: Joi.string().allow(null)
});

const signinSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string()
    .min(6)
    .message("Password length must be at least 6 characters long")
    .required()
});

class AuthController extends BaseController {
  constructor(model) {
    super(model);
    router.post("/signin", this.validation(signinSchema), this.signIn);
    router.post("/signup", this.validation(signupSchema), this.signUp);
  }

  signIn = async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const user = await this.model.getOne({ where: { email } });
      // eslint-disable-next-line no-undef
      if (!user) return next(new ValidationError("Invalid email or password"));

      const isMatch = await checkPassword(password, user.password);
      if (!isMatch) {
        // eslint-disable-next-line no-undef
        return next(new ValidationError("Invalid email or password"));
      }

      const token = createToken({ id: user.id, role: user.role });

      return res.status(200).json(
        this.apiSend({
          code: 200,
          message: "SignIn success",
          data: {
            token,
            user: {
              ...user,
              id: undefined,
              password: undefined
            }
          }
        })
      );
    } catch (error) {
      // eslint-disable-next-line no-undef
      next(new ServerError(error));
    }
  };

  signUp = async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const user = await this.model.getOne({ where: { email } });

      if (user) {
        // eslint-disable-next-line no-undef
        return next(new ValidationError("Email already exists"));
      }

      const newUser = await this.model.set({
        email: email,
        password: await encryptPassword(password),
        role: "Customer"
      });

      return res.status(201).json(
        this.apiSend({
          code: 201,
          message: "SignUp success",
          data: {
            ...newUser,
            id: undefined,
            password: undefined
          }
        })
      );
    } catch (error) {
      console.log(error);

      // eslint-disable-next-line no-undef
      next(new ServerError(error));
    }
  };
}

new AuthController(users);

module.exports = router;
