const { verifyToken } = require("../helpers/jwt");
const UserModel = require("../models/users");
const user = new UserModel();

const authorize = async (req, res, next) => {
  try {
    const bearerToken = req.headers.authorization;
    if (!bearerToken) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const token = bearerToken?.split(" ")[1];
    const payload = verifyToken(token);

    req.user = await user.getById(payload.id);
    next();
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const checkRole = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Forbidden" });
    }
    next();
  };
};

module.exports = { authorize, checkRole };
