const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const ACCESS = [
  {
    id: 1,
    visible: true,
    grant: {
      create: true,
      update: true,
      delete: true,
      read: true
    },
    role_id: 2,
    menu_id: 1,
    createdBy: "Super Duper Admin"
  }, {
    id: 2,
    visible: true,
    grant: {
      create: false,
      update: false,
      delete: false,
      read: true
    },
    role_id: 3,
    menu_id: 1,
    createdBy: "Super Duper Admin"
  }, {
    id: 3,
    visible: true,
    grant: {
      create: true,
      update: true,
      delete: false,
      read: true,
      readAll: false,
    },
    role_id: 2,
    menu_id: 2,
    createdBy: "Super Duper Admin"
  }, {
    id: 4,
    visible: false,
    grant: {
      create: false,
      update: true,
      delete: false,
      read: false,
      readAll: false,
    },
    role_id: 3,
    menu_id: 2,
    createdBy: "Super Duper Admin"
  }
];

const accessSeed = async () => {
  await prisma.access.deleteMany();
  return await prisma.access.createMany({
    data: ACCESS
  });
}

module.exports = accessSeed;
