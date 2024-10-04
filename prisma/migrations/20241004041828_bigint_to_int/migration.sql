-- CreateTable
CREATE TABLE "cars" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR,
    "manufacturer" VARCHAR,
    "licenseNumber" VARCHAR,
    "seat" INTEGER,
    "baggage" INTEGER,
    "transmission" VARCHAR,
    "year" DATE,
    "description" TEXT,
    "isDriver" BOOLEAN DEFAULT false,
    "isAvailable" BOOLEAN DEFAULT true,
    "img" TEXT,
    "price" INTEGER,
    "createdAt" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "createBy" VARCHAR,
    "updateAt" TIMESTAMP(3),
    "updateBy" VARCHAR,

    CONSTRAINT "cars_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "orders" (
    "id" SERIAL NOT NULL,
    "orderNumber" VARCHAR,
    "car_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "payment_id" INTEGER NOT NULL,
    "status" VARCHAR,
    "paymentReceipt" TEXT,
    "total" DOUBLE PRECISION,
    "isDriver" BOOLEAN,
    "startTime" TIMESTAMP(6),
    "finishTime" TIMESTAMP(6),
    "createdAt" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "createBy" VARCHAR,
    "updateAt" TIMESTAMP(3),
    "updateBy" VARCHAR,

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payments" (
    "id" SERIAL NOT NULL,
    "type" VARCHAR,
    "company" VARCHAR,
    "accountNumber" VARCHAR,
    "createdAt" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "createBy" VARCHAR,
    "updateAt" TIMESTAMP(3),
    "updateBy" VARCHAR,

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR NOT NULL,
    "email" VARCHAR(30) NOT NULL,
    "password" VARCHAR NOT NULL,
    "address" VARCHAR NOT NULL,
    "gender" VARCHAR,
    "phoneNumber" VARCHAR NOT NULL,
    "driverLicense" TEXT,
    "avatar" TEXT,
    "role" VARCHAR NOT NULL,
    "birthdate" DATE,
    "createdAt" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "createBy" VARCHAR,
    "updateAt" TIMESTAMP(3),
    "updateBy" VARCHAR,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "orders_orderNumber_key" ON "orders"("orderNumber");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_phoneNumber_key" ON "users"("phoneNumber");

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_car_id_fkey" FOREIGN KEY ("car_id") REFERENCES "cars"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_payment_id_fkey" FOREIGN KEY ("payment_id") REFERENCES "payments"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
