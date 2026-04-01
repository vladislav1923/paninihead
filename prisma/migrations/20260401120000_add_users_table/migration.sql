-- CreateTable
CREATE TABLE "Users" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_username_key" ON "Users"("username");

-- AlterTable
ALTER TABLE "Collections"
ADD COLUMN "userId" TEXT;

-- CreateIndex
CREATE INDEX "Collections_userId_idx" ON "Collections"("userId");

-- AddForeignKey
ALTER TABLE "Collections"
ADD CONSTRAINT "Collections_userId_fkey"
FOREIGN KEY ("userId") REFERENCES "Users"("id")
ON DELETE SET NULL ON UPDATE CASCADE;
