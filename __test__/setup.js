/* eslint-disable no-undef */
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const server = require("../index");

const tables = ["access", "menus", "orders", "cars", "users", "roles"]; // "users", "orders", "cars", "roles", "access", "menus"];

afterAll(() => {
  tables.forEach(async (table) => {
    await prisma[table].deleteMany();
    await prisma.$queryRawUnsafe(
      `ALTER SEQUENCE "${table}_id_seq" RESTART WITH 1`
    );
  });

  server.close();
  console.log("end test");
});
