-- CreateTable
CREATE TABLE "Exchangers" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "collectionId" TEXT NOT NULL,
    "has" INTEGER[],
    "needs" INTEGER[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Exchangers_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Exchangers" ADD CONSTRAINT "Exchangers_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "Collections"("id") ON DELETE CASCADE ON UPDATE CASCADE;
