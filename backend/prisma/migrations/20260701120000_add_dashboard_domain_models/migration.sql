-- CreateEnum
CREATE TYPE "ContentStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "ActivityEventType" AS ENUM ('CONTENT_CREATED', 'CONTENT_UPDATED', 'CONTENT_PUBLISHED', 'ASSET_UPLOADED', 'MEMBER_JOINED', 'MEMBER_ACTIVE');

-- AlterTable
ALTER TABLE "TenantUser"
ADD COLUMN "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE "ContentItem" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "siteId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "status" "ContentStatus" NOT NULL DEFAULT 'DRAFT',
    "createdByTenantUserId" TEXT,
    "updatedByTenantUserId" TEXT,
    "publishedByTenantUserId" TEXT,
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ContentItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Asset" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "siteId" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "mimeType" TEXT,
    "byteSize" BIGINT NOT NULL DEFAULT 0,
    "storageKey" TEXT NOT NULL,
    "uploadedByTenantUserId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Asset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ActivityEvent" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "siteId" TEXT,
    "actorTenantUserId" TEXT,
    "type" "ActivityEventType" NOT NULL,
    "entityType" TEXT,
    "entityId" TEXT,
    "description" TEXT NOT NULL,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ActivityEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Site_tenantId_id_key" ON "Site"("tenantId", "id");

-- CreateIndex
CREATE UNIQUE INDEX "TenantUser_tenantId_id_key" ON "TenantUser"("tenantId", "id");

-- CreateIndex
CREATE INDEX "ContentItem_tenantId_createdAt_idx" ON "ContentItem"("tenantId", "createdAt");

-- CreateIndex
CREATE INDEX "ContentItem_tenantId_siteId_createdAt_idx" ON "ContentItem"("tenantId", "siteId", "createdAt");

-- CreateIndex
CREATE INDEX "ContentItem_tenantId_siteId_updatedAt_idx" ON "ContentItem"("tenantId", "siteId", "updatedAt");

-- CreateIndex
CREATE INDEX "ContentItem_tenantId_siteId_publishedAt_idx" ON "ContentItem"("tenantId", "siteId", "publishedAt");

-- CreateIndex
CREATE INDEX "ContentItem_tenantId_siteId_status_idx" ON "ContentItem"("tenantId", "siteId", "status");

-- CreateIndex
CREATE INDEX "ContentItem_tenantId_siteId_idx" ON "ContentItem"("tenantId", "siteId");

-- CreateIndex
CREATE UNIQUE INDEX "Asset_tenantId_storageKey_key" ON "Asset"("tenantId", "storageKey");

-- CreateIndex
CREATE INDEX "Asset_tenantId_createdAt_idx" ON "Asset"("tenantId", "createdAt");

-- CreateIndex
CREATE INDEX "Asset_tenantId_siteId_idx" ON "Asset"("tenantId", "siteId");

-- CreateIndex
CREATE INDEX "ActivityEvent_tenantId_createdAt_idx" ON "ActivityEvent"("tenantId", "createdAt");

-- CreateIndex
CREATE INDEX "ActivityEvent_tenantId_siteId_createdAt_idx" ON "ActivityEvent"("tenantId", "siteId", "createdAt");

-- CreateIndex
CREATE INDEX "ActivityEvent_tenantId_siteId_type_createdAt_idx" ON "ActivityEvent"("tenantId", "siteId", "type", "createdAt");

-- CreateIndex
CREATE INDEX "ActivityEvent_tenantId_siteId_actorTenantUserId_createdAt_idx" ON "ActivityEvent"("tenantId", "siteId", "actorTenantUserId", "createdAt");

-- AddCheckConstraint
ALTER TABLE "ActivityEvent" ADD CONSTRAINT "ActivityEvent_site_required_for_site_events_check" CHECK ("type" NOT IN ('CONTENT_CREATED', 'CONTENT_UPDATED', 'CONTENT_PUBLISHED', 'ASSET_UPLOADED') OR "siteId" IS NOT NULL);

-- AddForeignKey
ALTER TABLE "ContentItem" ADD CONSTRAINT "ContentItem_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContentItem" ADD CONSTRAINT "ContentItem_tenantId_siteId_fkey" FOREIGN KEY ("tenantId", "siteId") REFERENCES "Site"("tenantId", "id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContentItem" ADD CONSTRAINT "ContentItem_tenantId_createdByTenantUserId_fkey" FOREIGN KEY ("tenantId", "createdByTenantUserId") REFERENCES "TenantUser"("tenantId", "id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContentItem" ADD CONSTRAINT "ContentItem_tenantId_updatedByTenantUserId_fkey" FOREIGN KEY ("tenantId", "updatedByTenantUserId") REFERENCES "TenantUser"("tenantId", "id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContentItem" ADD CONSTRAINT "ContentItem_tenantId_publishedByTenantUserId_fkey" FOREIGN KEY ("tenantId", "publishedByTenantUserId") REFERENCES "TenantUser"("tenantId", "id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Asset" ADD CONSTRAINT "Asset_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Asset" ADD CONSTRAINT "Asset_tenantId_siteId_fkey" FOREIGN KEY ("tenantId", "siteId") REFERENCES "Site"("tenantId", "id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Asset" ADD CONSTRAINT "Asset_tenantId_uploadedByTenantUserId_fkey" FOREIGN KEY ("tenantId", "uploadedByTenantUserId") REFERENCES "TenantUser"("tenantId", "id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivityEvent" ADD CONSTRAINT "ActivityEvent_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivityEvent" ADD CONSTRAINT "ActivityEvent_tenantId_siteId_fkey" FOREIGN KEY ("tenantId", "siteId") REFERENCES "Site"("tenantId", "id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivityEvent" ADD CONSTRAINT "ActivityEvent_tenantId_actorTenantUserId_fkey" FOREIGN KEY ("tenantId", "actorTenantUserId") REFERENCES "TenantUser"("tenantId", "id") ON DELETE RESTRICT ON UPDATE CASCADE;
