/*
  Warnings:

  - You are about to drop the column `assignees` on the `Task` table. All the data in the column will be lost.
  - You are about to drop the column `recurrence` on the `Task` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Task" DROP COLUMN "assignees",
DROP COLUMN "recurrence";
