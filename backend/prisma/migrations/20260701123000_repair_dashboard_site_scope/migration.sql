-- Repair dev databases where the dashboard migration was applied before site-scoped
-- activity support was added to the migration file.

ALTER TABLE "ActivityEvent"
ADD COLUMN IF NOT EXISTS "siteId" TEXT;

UPDATE "ContentItem"
SET "siteId" = (
    SELECT "Site"."id"
    FROM "Site"
    WHERE "Site"."tenantId" = "ContentItem"."tenantId"
    ORDER BY "Site"."createdAt" ASC, "Site"."id" ASC
    LIMIT 1
)
WHERE "siteId" IS NULL;

UPDATE "Asset"
SET "siteId" = (
    SELECT "Site"."id"
    FROM "Site"
    WHERE "Site"."tenantId" = "Asset"."tenantId"
    ORDER BY "Site"."createdAt" ASC, "Site"."id" ASC
    LIMIT 1
)
WHERE "siteId" IS NULL;

UPDATE "ActivityEvent"
SET "siteId" = (
    SELECT "Site"."id"
    FROM "Site"
    WHERE "Site"."tenantId" = "ActivityEvent"."tenantId"
    ORDER BY "Site"."createdAt" ASC, "Site"."id" ASC
    LIMIT 1
)
WHERE "siteId" IS NULL
AND "type" IN ('CONTENT_CREATED', 'CONTENT_UPDATED', 'CONTENT_PUBLISHED', 'ASSET_UPLOADED');

ALTER TABLE "ContentItem"
ALTER COLUMN "siteId" SET NOT NULL;

ALTER TABLE "Asset"
ALTER COLUMN "siteId" SET NOT NULL;

CREATE INDEX IF NOT EXISTS "ContentItem_tenantId_siteId_createdAt_idx" ON "ContentItem"("tenantId", "siteId", "createdAt");
CREATE INDEX IF NOT EXISTS "ContentItem_tenantId_siteId_updatedAt_idx" ON "ContentItem"("tenantId", "siteId", "updatedAt");
CREATE INDEX IF NOT EXISTS "ContentItem_tenantId_siteId_publishedAt_idx" ON "ContentItem"("tenantId", "siteId", "publishedAt");
CREATE INDEX IF NOT EXISTS "ContentItem_tenantId_siteId_status_idx" ON "ContentItem"("tenantId", "siteId", "status");
CREATE INDEX IF NOT EXISTS "ContentItem_tenantId_siteId_idx" ON "ContentItem"("tenantId", "siteId");
CREATE INDEX IF NOT EXISTS "Asset_tenantId_siteId_idx" ON "Asset"("tenantId", "siteId");
CREATE INDEX IF NOT EXISTS "ActivityEvent_tenantId_siteId_createdAt_idx" ON "ActivityEvent"("tenantId", "siteId", "createdAt");
CREATE INDEX IF NOT EXISTS "ActivityEvent_tenantId_siteId_type_createdAt_idx" ON "ActivityEvent"("tenantId", "siteId", "type", "createdAt");
CREATE INDEX IF NOT EXISTS "ActivityEvent_tenantId_siteId_actorTenantUserId_createdAt_idx" ON "ActivityEvent"("tenantId", "siteId", "actorTenantUserId", "createdAt");

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'ActivityEvent_site_required_for_site_events_check'
  ) THEN
    ALTER TABLE "ActivityEvent"
    ADD CONSTRAINT "ActivityEvent_site_required_for_site_events_check"
    CHECK ("type" NOT IN ('CONTENT_CREATED', 'CONTENT_UPDATED', 'CONTENT_PUBLISHED', 'ASSET_UPLOADED') OR "siteId" IS NOT NULL);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'ActivityEvent_tenantId_siteId_fkey'
  ) THEN
    ALTER TABLE "ActivityEvent"
    ADD CONSTRAINT "ActivityEvent_tenantId_siteId_fkey"
    FOREIGN KEY ("tenantId", "siteId") REFERENCES "Site"("tenantId", "id") ON DELETE RESTRICT ON UPDATE CASCADE;
  END IF;
END $$;
