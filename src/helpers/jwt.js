const jwt = require("jsonwebtoken");
const { SECRET } = process.env;

const createToken = (payload) => {
  return jwt.sign(payload, SECRET, { expiresIn: "1800s" });
};

const verifyToken = (token) => {
  return jwt.verify(token, SECRET);
};

module.exports = {
  createToken,
  verifyToken
};