/*
  Warnings:

  - A unique constraint covering the columns `[habitId,date]` on the table `Habitlog` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Habitlog_habitId_date_key" ON "Habitlog"("habitId", "date");
