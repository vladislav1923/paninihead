-- CreateTable
CREATE TABLE "Deals" (
    "id" TEXT NOT NULL,
    "collectionId" TEXT NOT NULL,
    "exchangerId" TEXT NOT NULL,
    "inNumbers" INTEGER[],
    "outNumbers" INTEGER[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Deals_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Deals" ADD CONSTRAINT "Deals_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "Collections"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Deals" ADD CONSTRAINT "Deals_exchangerId_fkey" FOREIGN KEY ("exchangerId") REFERENCES "Exchangers"("id") ON DELETE CASCADE ON UPDATE CASCADE;
