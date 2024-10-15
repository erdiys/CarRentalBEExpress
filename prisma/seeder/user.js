const { PrismaClient } = require("@prisma/client");
const { encryptPassword } = require("../../src/helpers/bcrypt");

const prisma = new PrismaClient();

const userSeed = async () => {
  return await prisma.users.upsert({
    where: { email: "superadmin@domain.com" },
    update: {},
    create: {
      email: "superadmin@domain.com",
      name: "Super Duper Admin",
      password: await encryptPassword("12345678"),
      role_id: 1
    }
  });
};

module.exports = userSeed;
