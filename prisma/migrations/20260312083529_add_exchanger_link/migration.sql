/*
  Warnings:

  - Added the required column `link` to the `Exchangers` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Exchangers" ADD COLUMN     "link" TEXT NOT NULL;
