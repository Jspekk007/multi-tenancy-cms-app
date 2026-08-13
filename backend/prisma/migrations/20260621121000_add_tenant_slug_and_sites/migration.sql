-- AlterTable
ALTER TABLE "Tenant" ADD COLUMN "slug" TEXT;

-- Backfill tenant slugs from names for existing rows.
WITH normalized AS (
  SELECT
    "id",
    COALESCE(
      NULLIF(
        TRIM(
          BOTH '-'
          FROM LOWER(REGEXP_REPLACE("name", '[^a-zA-Z0-9]+', '-', 'g'))
        ),
        ''
      ),
      'workspace'
    ) AS "baseSlug"
  FROM "Tenant"
),
ranked AS (
  SELECT
    "id",
    "baseSlug",
    ROW_NUMBER() OVER (PARTITION BY "baseSlug" ORDER BY "id") AS "rank"
  FROM normalized
)
UPDATE "Tenant"
SET "slug" = CASE
  WHEN ranked."rank" = 1 THEN ranked."baseSlug"
  ELSE ranked."baseSlug" || '-' || ranked."rank"
END
FROM ranked
WHERE "Tenant"."id" = ranked."id";

ALTER TABLE "Tenant" ALTER COLUMN "slug" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Tenant_slug_key" ON "Tenant"("slug");

-- CreateTable
CREATE TABLE "Site" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Site_pkey" PRIMARY KEY ("id")
);

-- Backfill one default site per existing tenant.
INSERT INTO "Site" ("id", "tenantId", "name", "slug", "createdAt", "updatedAt")
SELECT
  'site_' || SUBSTRING(MD5("id" || ':main') FROM 1 FOR 24),
  "id",
  'Main Site',
  'main',
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
FROM "Tenant";

-- CreateIndex
CREATE UNIQUE INDEX "Site_tenantId_slug_key" ON "Site"("tenantId", "slug");

-- CreateIndex
CREATE INDEX "Site_tenantId_idx" ON "Site"("tenantId");

-- AddForeignKey
ALTER TABLE "Site" ADD CONSTRAINT "Site_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
