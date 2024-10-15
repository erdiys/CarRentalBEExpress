const { PrismaClient } = require("@prisma/client");

const accessSeed = require("./access");
const roleSeed = require("./role");
const userSeed = require("./user");
const menuSeed = require("./menu");

const prisma = new PrismaClient();

async function main() {
  const role = await roleSeed();
  const user = await userSeed();
  const menu = await menuSeed();
  const access = await accessSeed();

  console.log(user, role, menu, access);
  console.log(`Database has been seeded. 🌱`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
