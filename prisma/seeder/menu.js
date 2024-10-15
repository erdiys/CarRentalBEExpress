const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const MENUS = [
  {
    id: 1,
    name: "CARS",
    title: "Cars",
    icon: null,
    path: "/cars",
    isSubmenu: false,
    permission: ["create", "read", "update", "delete", "export", "import"],
    createdBy: "Super Duper Admin"
  }, {
    id: 2,
    name: "USERS",
    title: "Users",
    icon: null,
    path: "/users",
    isSubmenu: false,
    permission: ["create", "read", "readAll", "update", "delete", "export", "import"],
    createdBy: "Super Duper Admin"
  }
];

const menuSeed = async () => {
  await prisma.menus.deleteMany();
  return await prisma.menus.createMany({
    data: MENUS
  });
};

module.exports = menuSeed;
