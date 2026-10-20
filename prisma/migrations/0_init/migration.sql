-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "handle" TEXT NOT NULL,
    "contact" TEXT,
    "pinHash" TEXT NOT NULL,
    "salt" TEXT NOT NULL,
    "ageBand" TEXT NOT NULL DEFAULT 'adult',
    "parentPinHash" TEXT,
    "parentSalt" TEXT,
    "token" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "CloudSave" (
    "accountId" TEXT NOT NULL PRIMARY KEY,
    "data" TEXT NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 10,
    "sig" TEXT,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "CloudSave_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "LivePresence" (
    "accountId" TEXT NOT NULL PRIMARY KEY,
    "handle" TEXT NOT NULL,
    "band" TEXT NOT NULL,
    "street" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "LiveEvent" (
    "seq" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "kind" TEXT NOT NULL,
    "channel" TEXT NOT NULL,
    "actor" TEXT NOT NULL,
    "band" TEXT NOT NULL,
    "payload" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "AssociationRow" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "motto" TEXT NOT NULL,
    "founder" TEXT NOT NULL,
    "treasury" INTEGER NOT NULL DEFAULT 0,
    "chainTail" TEXT NOT NULL,
    "ledgerJson" TEXT NOT NULL DEFAULT '[]',
    "membersJson" TEXT NOT NULL DEFAULT '[]',
    "contractsJson" TEXT NOT NULL DEFAULT '[]',
    "createdDay" INTEGER NOT NULL DEFAULT 1,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "TradeRow" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "fromHandle" TEXT NOT NULL,
    "toHandle" TEXT NOT NULL,
    "giveCash" INTEGER NOT NULL DEFAULT 0,
    "wantCash" INTEGER NOT NULL DEFAULT 0,
    "terms" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'offered',
    "day" INTEGER NOT NULL DEFAULT 1,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "AjoRow" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "contribution" INTEGER NOT NULL,
    "orderJson" TEXT NOT NULL,
    "round" INTEGER NOT NULL DEFAULT 1,
    "roundStartDay" INTEGER NOT NULL DEFAULT 1,
    "pot" INTEGER NOT NULL DEFAULT 0,
    "paidJson" TEXT NOT NULL DEFAULT '{}',
    "paidThisRoundJson" TEXT NOT NULL DEFAULT '[]',
    "defaultersJson" TEXT NOT NULL DEFAULT '[]',
    "status" TEXT NOT NULL DEFAULT 'open',
    "createdDay" INTEGER NOT NULL DEFAULT 1,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "TelemetryRow" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "accountId" TEXT NOT NULL,
    "day" INTEGER NOT NULL,
    "counters" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "ForgeVote" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "accountId" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "StreamRow" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "host" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "viewersJson" TEXT NOT NULL DEFAULT '[]',
    "startedDay" INTEGER NOT NULL DEFAULT 1,
    "status" TEXT NOT NULL DEFAULT 'live',
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "FriendRow" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "ownerHandle" TEXT NOT NULL,
    "peerHandle" TEXT NOT NULL,
    "state" TEXT NOT NULL DEFAULT 'pending',
    "requestedBy" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "ReportRow" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "byHandle" TEXT NOT NULL,
    "targetHandle" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'open',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "WalletRow" (
    "handle" TEXT NOT NULL PRIMARY KEY,
    "balance" INTEGER NOT NULL DEFAULT 0,
    "version" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "LedgerRow" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "fromHandle" TEXT NOT NULL,
    "toHandle" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "kind" TEXT NOT NULL,
    "idemKey" TEXT NOT NULL,
    "chainHash" TEXT NOT NULL,
    "note" TEXT NOT NULL DEFAULT '',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "ProfileRow" (
    "accountId" TEXT NOT NULL PRIMARY KEY,
    "handle" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "avatarLook" TEXT NOT NULL,
    "bio" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "VehicleRow" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "handle" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "plate" TEXT NOT NULL,
    "paint" TEXT NOT NULL DEFAULT '',
    "fuel" REAL NOT NULL DEFAULT 1,
    "condition" REAL NOT NULL DEFAULT 1,
    "x" REAL NOT NULL DEFAULT 0,
    "z" REAL NOT NULL DEFAULT 0,
    "hd" REAL NOT NULL DEFAULT 0,
    "odometer" REAL NOT NULL DEFAULT 0,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "Account_handle_key" ON "Account"("handle");

-- CreateIndex
CREATE UNIQUE INDEX "Account_contact_key" ON "Account"("contact");

-- CreateIndex
CREATE UNIQUE INDEX "TelemetryRow_accountId_day_key" ON "TelemetryRow"("accountId", "day");

-- CreateIndex
CREATE UNIQUE INDEX "FriendRow_ownerHandle_peerHandle_key" ON "FriendRow"("ownerHandle", "peerHandle");

-- CreateIndex
CREATE UNIQUE INDEX "LedgerRow_idemKey_key" ON "LedgerRow"("idemKey");

-- CreateIndex
CREATE UNIQUE INDEX "ProfileRow_handle_key" ON "ProfileRow"("handle");

-- CreateIndex
CREATE UNIQUE INDEX "VehicleRow_handle_model_key" ON "VehicleRow"("handle", "model");

