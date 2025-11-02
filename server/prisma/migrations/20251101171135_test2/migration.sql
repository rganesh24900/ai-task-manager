/*
  Warnings:

  - The values [LOW,MEDIUM,HIGH] on the enum `Priority` will be removed. If these variants are still used in the database, this will fail.
  - Made the column `password` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Priority_new" AS ENUM ('Low', 'Medium', 'High');
ALTER TABLE "public"."Task" ALTER COLUMN "priority" DROP DEFAULT;
ALTER TABLE "Task" ALTER COLUMN "priority" TYPE "Priority_new" USING ("priority"::text::"Priority_new");
ALTER TYPE "Priority" RENAME TO "Priority_old";
ALTER TYPE "Priority_new" RENAME TO "Priority";
DROP TYPE "public"."Priority_old";
ALTER TABLE "Task" ALTER COLUMN "priority" SET DEFAULT 'Low';
COMMIT;

-- AlterTable
ALTER TABLE "Task" ADD COLUMN     "assignees" JSONB,
ADD COLUMN     "dueDate" TIMESTAMP(3),
ADD COLUMN     "dueTime" TEXT,
ADD COLUMN     "llmParsed" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "recurrence" TEXT,
ADD COLUMN     "tags" JSONB,
ALTER COLUMN "priority" SET DEFAULT 'Low';

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "password" SET NOT NULL;
