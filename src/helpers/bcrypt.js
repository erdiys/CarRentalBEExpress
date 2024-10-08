const bcrypt = require("bcryptjs");
const salt = bcrypt.genSaltSync(10);

const encryptPassword = async (password) => await bcrypt.hash(password, salt);

const checkPassword = async (password, encryptedPassword) => await bcrypt.compare(password, encryptedPassword);

module.exports = {
  encryptPassword,
  checkPassword
};
