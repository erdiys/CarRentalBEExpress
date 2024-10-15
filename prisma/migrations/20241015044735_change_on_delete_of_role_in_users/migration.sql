/*
  Warnings:

  - You are about to drop the column `createBy` on the `access` table. All the data in the column will be lost.
  - You are about to drop the column `updateAt` on the `access` table. All the data in the column will be lost.
  - You are about to drop the column `updateBy` on the `access` table. All the data in the column will be lost.
  - You are about to drop the column `createBy` on the `cars` table. All the data in the column will be lost.
  - You are about to drop the column `updateAt` on the `cars` table. All the data in the column will be lost.
  - You are about to drop the column `updateBy` on the `cars` table. All the data in the column will be lost.
  - You are about to drop the column `createBy` on the `menus` table. All the data in the column will be lost.
  - You are about to drop the column `updateAt` on the `menus` table. All the data in the column will be lost.
  - You are about to drop the column `updateBy` on the `menus` table. All the data in the column will be lost.
  - You are about to drop the column `createBy` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `updateAt` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `updateBy` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `createBy` on the `payments` table. All the data in the column will be lost.
  - You are about to drop the column `updateAt` on the `payments` table. All the data in the column will be lost.
  - You are about to drop the column `updateBy` on the `payments` table. All the data in the column will be lost.
  - You are about to drop the column `createBy` on the `roles` table. All the data in the column will be lost.
  - You are about to drop the column `updateAt` on the `roles` table. All the data in the column will be lost.
  - You are about to drop the column `updateBy` on the `roles` table. All the data in the column will be lost.
  - You are about to drop the column `createBy` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `updateAt` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `updateBy` on the `users` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_role_id_fkey";

-- AlterTable
ALTER TABLE "access" DROP COLUMN "createBy",
DROP COLUMN "updateAt",
DROP COLUMN "updateBy",
ADD COLUMN     "createdBy" VARCHAR,
ADD COLUMN     "updatedAt" TIMESTAMP(3),
ADD COLUMN     "updatedBy" VARCHAR;

-- AlterTable
ALTER TABLE "cars" DROP COLUMN "createBy",
DROP COLUMN "updateAt",
DROP COLUMN "updateBy",
ADD COLUMN     "createdBy" VARCHAR,
ADD COLUMN     "updatedAt" TIMESTAMP(3),
ADD COLUMN     "updatedBy" VARCHAR;

-- AlterTable
ALTER TABLE "menus" DROP COLUMN "createBy",
DROP COLUMN "updateAt",
DROP COLUMN "updateBy",
ADD COLUMN     "createdBy" VARCHAR,
ADD COLUMN     "updatedAt" TIMESTAMP(3),
ADD COLUMN     "updatedBy" VARCHAR;

-- AlterTable
ALTER TABLE "orders" DROP COLUMN "createBy",
DROP COLUMN "updateAt",
DROP COLUMN "updateBy",
ADD COLUMN     "createdBy" VARCHAR,
ADD COLUMN     "updatedAt" TIMESTAMP(3),
ADD COLUMN     "updatedBy" VARCHAR;

-- AlterTable
ALTER TABLE "payments" DROP COLUMN "createBy",
DROP COLUMN "updateAt",
DROP COLUMN "updateBy",
ADD COLUMN     "createdBy" VARCHAR,
ADD COLUMN     "updatedAt" TIMESTAMP(3),
ADD COLUMN     "updatedBy" VARCHAR;

-- AlterTable
ALTER TABLE "roles" DROP COLUMN "createBy",
DROP COLUMN "updateAt",
DROP COLUMN "updateBy",
ADD COLUMN     "createdBy" VARCHAR,
ADD COLUMN     "updatedAt" TIMESTAMP(3),
ADD COLUMN     "updatedBy" VARCHAR;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "createBy",
DROP COLUMN "updateAt",
DROP COLUMN "updateBy",
ADD COLUMN     "createdBy" VARCHAR,
ADD COLUMN     "updatedAt" TIMESTAMP(3),
ADD COLUMN     "updatedBy" VARCHAR;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "access" DROP CONSTRAINT "access_role_id_fkey", ADD CONSTRAINT "access_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "access" DROP CONSTRAINT "access_menu_id_fkey", ADD CONSTRAINT "access_menu_id_fkey" FOREIGN KEY ("menu_id") REFERENCES "menus"("id") ON DELETE CASCADE ON UPDATE CASCADE;
