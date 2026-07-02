import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const schema = readFileSync(new URL('../../../prisma/schema.prisma', import.meta.url), 'utf8');

const getModelBlock = (modelName: string): string => {
  const match = schema.match(new RegExp(`model ${modelName} \\{[\\s\\S]*?\\n\\}`));

  if (!match) {
    assert.fail(`Model ${modelName} not found in Prisma schema`);
  }

  return match[0];
};

test('dashboard domain models use tenant-aware site and membership relations', () => {
  const contentItemModel = getModelBlock('ContentItem');
  const assetModel = getModelBlock('Asset');
  const activityEventModel = getModelBlock('ActivityEvent');

  assert.match(contentItemModel, /\bsiteId\s+String\b/);
  assert.match(
    contentItemModel,
    /site\s+Site\s+@relation\(fields:\s+\[tenantId,\s+siteId\],\s+references:\s+\[tenantId,\s+id\]/,
  );
  assert.match(assetModel, /\bsiteId\s+String\b/);
  assert.match(
    assetModel,
    /site\s+Site\s+@relation\(fields:\s+\[tenantId,\s+siteId\],\s+references:\s+\[tenantId,\s+id\]/,
  );
  assert.match(activityEventModel, /\bsiteId\s+String\?/);
  assert.match(
    activityEventModel,
    /site\s+Site\?\s+@relation\(fields:\s+\[tenantId,\s+siteId\],\s+references:\s+\[tenantId,\s+id\]/,
  );
  assert.match(
    contentItemModel,
    /createdBy\s+TenantUser\?\s+@relation\("ContentCreatedByMembership",\s+fields:\s+\[tenantId,\s+createdByTenantUserId\],\s+references:\s+\[tenantId,\s+id\]/,
  );
  assert.match(
    activityEventModel,
    /actorTenantUser\s+TenantUser\?\s+@relation\("ActivityActorMembership",\s+fields:\s+\[tenantId,\s+actorTenantUserId\],\s+references:\s+\[tenantId,\s+id\]/,
  );
  assert.match(contentItemModel, /@@index\(\[tenantId,\s+siteId,\s+createdAt\]\)/);
  assert.match(assetModel, /@@index\(\[tenantId,\s+siteId\]\)/);
  assert.match(activityEventModel, /@@index\(\[tenantId,\s+siteId,\s+type,\s+createdAt\]\)/);
  assert.match(
    activityEventModel,
    /@@index\(\[tenantId,\s+siteId,\s+actorTenantUserId,\s+createdAt\]\)/,
  );
});
