/*
  Warnings:

  - Made the column `car_id` on table `orders` required. This step will fail if there are existing NULL values in that column.
  - Made the column `user_id` on table `orders` required. This step will fail if there are existing NULL values in that column.
  - Made the column `payment_id` on table `orders` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "cars" ALTER COLUMN "updateAt" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "orders" ALTER COLUMN "car_id" SET NOT NULL,
ALTER COLUMN "user_id" SET NOT NULL,
ALTER COLUMN "payment_id" SET NOT NULL,
ALTER COLUMN "createdAt" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "updateAt" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "payments" ALTER COLUMN "createdAt" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "updateAt" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "createdAt" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "updateAt" SET DATA TYPE TIMESTAMP(3);
