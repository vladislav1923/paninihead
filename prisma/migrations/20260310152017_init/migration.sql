-- CreateEnum
CREATE TYPE "CollectionStatus" AS ENUM ('InProgress', 'Completed');

-- CreateTable
CREATE TABLE "Collections" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "status" "CollectionStatus" NOT NULL DEFAULT 'InProgress',
    "imageUrl" TEXT,
    "total" INTEGER NOT NULL,
    "collected" INTEGER[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "Collections_pkey" PRIMARY KEY ("id")
);
