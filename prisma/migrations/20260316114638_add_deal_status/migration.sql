-- CreateEnum
CREATE TYPE "DealStatus" AS ENUM ('Completed', 'Reverted');

-- AlterTable
ALTER TABLE "Deals" ADD COLUMN     "status" "DealStatus" NOT NULL DEFAULT 'Completed';
