/*
  Warnings:

  - Changed the type of `entityId` on the `AuditLog` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "AuditLog" DROP COLUMN "entityId",
ADD COLUMN     "entityId" UUID NOT NULL;

-- CreateIndex
CREATE INDEX "AuditLog_entityId_idx" ON "AuditLog"("entityId");
