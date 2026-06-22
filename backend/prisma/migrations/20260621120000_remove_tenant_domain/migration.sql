-- DropIndex
DROP INDEX IF EXISTS "Tenant_domain_key";

-- AlterTable
ALTER TABLE "Tenant" DROP COLUMN IF EXISTS "domain";
