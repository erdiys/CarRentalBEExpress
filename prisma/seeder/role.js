const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const ROLE = [
  {
    id: 1,
    role: "SUPERADMIN",
    createdBy: "Super Duper Admin"
  },
  {
    id: 2,
    role: "ADMIN",
    createdBy: "Super Duper Admin"
  },
  {
    id: 3,
    role: "USER",
    createdBy: "Super Duper Admin"
  }
];

const roleSeed = () => {
  // await prisma.roles.deleteMany();
  ROLE.map(async (el) => {
    return await prisma.roles.upsert({
      where: { role: el.role },
      update: {},
      create: el
    });
  })
  
}

module.exports = roleSeed;
