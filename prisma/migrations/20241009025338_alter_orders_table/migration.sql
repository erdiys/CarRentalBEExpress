-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "isExpired" BOOLEAN DEFAULT false,
ALTER COLUMN "payment_id" DROP NOT NULL;
