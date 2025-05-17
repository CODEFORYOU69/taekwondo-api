/*
  Warnings:

  - Added the required column `competitionId` to the `WeighIn` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "WeighIn" ADD COLUMN     "competitionId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "WeighIn" ADD CONSTRAINT "WeighIn_competitionId_fkey" FOREIGN KEY ("competitionId") REFERENCES "Competition"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
