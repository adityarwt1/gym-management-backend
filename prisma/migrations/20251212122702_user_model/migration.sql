/*
  Warnings:

  - A unique constraint covering the columns `[uid]` on the table `Merchant` will be added. If there are existing duplicate values, this will fail.
  - The required column `uid` was added to the `Merchant` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE "Merchant" ADD COLUMN     "uid" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "User" (
    "uid" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "photoURL" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("uid")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_uid_key" ON "User"("uid");

-- CreateIndex
CREATE UNIQUE INDEX "Merchant_uid_key" ON "Merchant"("uid");

-- AddForeignKey
ALTER TABLE "Merchant" ADD CONSTRAINT "Merchant_uid_fkey" FOREIGN KEY ("uid") REFERENCES "User"("uid") ON DELETE RESTRICT ON UPDATE CASCADE;
