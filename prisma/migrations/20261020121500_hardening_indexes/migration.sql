-- THE HARDENING INDEXES (Phase 1-C): the money paths stop being table scans.
-- CreateIndex
CREATE INDEX "Account_token_idx" ON "Account"("token");
-- CreateIndex
CREATE INDEX "LedgerRow_fromHandle_createdAt_idx" ON "LedgerRow"("fromHandle", "createdAt");
-- CreateIndex
CREATE INDEX "LedgerRow_toHandle_idx" ON "LedgerRow"("toHandle");
-- CreateIndex
CREATE INDEX "VehicleRow_x_z_idx" ON "VehicleRow"("x", "z");
-- THE DMV LAW (hardening): one plate, ONE row — structural uniqueness.
-- The books were deduped first (scripts/repair-books.ts, 12 clones re-plated).
-- CreateIndex
CREATE UNIQUE INDEX "VehicleRow_plate_key" ON "VehicleRow"("plate");
