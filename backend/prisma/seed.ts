import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config({ path: '../.env', quiet: true });

const prisma = new PrismaClient();

const seedPassword = process.env.SEED_PASSWORD ?? 'Password123!';
const saltRounds = Number(process.env.SALT_ROUNDS ?? 10);

const tenantSeeds = [
  {
    key: 'globalProduction',
    id: 'tenant_global_production',
    name: 'Global Production',
    slug: 'global-production',
  },
  {
    key: 'northwindEditorial',
    id: 'tenant_northwind_editorial',
    name: 'Northwind Editorial',
    slug: 'northwind-editorial',
  },
  {
    key: 'acmeContentOps',
    id: 'tenant_acme_content_ops',
    name: 'Acme Content Ops',
    slug: 'acme-content-ops',
  },
] as const;

const siteSeeds = [
  {
    id: 'site_global_marketing',
    tenantKey: 'globalProduction',
    name: 'Marketing Site',
    slug: 'marketing',
  },
  {
    id: 'site_global_docs',
    tenantKey: 'globalProduction',
    name: 'Docs Portal',
    slug: 'docs',
  },
  {
    id: 'site_northwind_editorial',
    tenantKey: 'northwindEditorial',
    name: 'Editorial Site',
    slug: 'editorial',
  },
  {
    id: 'site_northwind_careers',
    tenantKey: 'northwindEditorial',
    name: 'Careers Site',
    slug: 'careers',
  },
  {
    id: 'site_acme_content_hub',
    tenantKey: 'acmeContentOps',
    name: 'Content Hub',
    slug: 'content-hub',
  },
  {
    id: 'site_acme_campaigns',
    tenantKey: 'acmeContentOps',
    name: 'Campaigns',
    slug: 'campaigns',
  },
] as const;

const roleSeeds = [
  {
    key: 'globalAdmin',
    id: 'role_global_admin',
    tenantKey: 'globalProduction',
    name: 'ADMIN',
    permissions: ['tenant:manage', 'content:manage', 'users:manage', 'settings:manage'],
  },
  {
    key: 'northwindAdmin',
    id: 'role_northwind_admin',
    tenantKey: 'northwindEditorial',
    name: 'ADMIN',
    permissions: ['tenant:manage', 'content:manage', 'users:manage', 'settings:manage'],
  },
  {
    key: 'acmeEditor',
    id: 'role_acme_editor',
    tenantKey: 'acmeContentOps',
    name: 'EDITOR',
    permissions: ['content:read', 'content:create', 'content:update'],
  },
  {
    key: 'globalViewer',
    id: 'role_global_viewer',
    tenantKey: 'globalProduction',
    name: 'VIEWER',
    permissions: ['content:read'],
  },
] as const;

const userSeeds = [
  {
    key: 'multiTenantAdmin',
    id: 'user_multi_tenant_admin',
    email: 'admin@atlas.local',
    isActive: true,
  },
  {
    key: 'singleTenantEditor',
    id: 'user_single_tenant_editor',
    email: 'editor@atlas.local',
    isActive: true,
  },
  {
    key: 'inactiveViewer',
    id: 'user_inactive_viewer',
    email: 'inactive@atlas.local',
    isActive: false,
  },
] as const;

const membershipSeeds = [
  {
    id: 'membership_admin_global',
    tenantKey: 'globalProduction',
    userKey: 'multiTenantAdmin',
    roleKey: 'globalAdmin',
  },
  {
    id: 'membership_admin_northwind',
    tenantKey: 'northwindEditorial',
    userKey: 'multiTenantAdmin',
    roleKey: 'northwindAdmin',
  },
  {
    id: 'membership_editor_acme',
    tenantKey: 'acmeContentOps',
    userKey: 'singleTenantEditor',
    roleKey: 'acmeEditor',
  },
  {
    id: 'membership_inactive_global',
    tenantKey: 'globalProduction',
    userKey: 'inactiveViewer',
    roleKey: 'globalViewer',
  },
] as const;

type TenantKey = (typeof tenantSeeds)[number]['key'];
type RoleKey = (typeof roleSeeds)[number]['key'];
type UserKey = (typeof userSeeds)[number]['key'];

async function main(): Promise<void> {
  const passwordHash = await bcrypt.hash(seedPassword, saltRounds);
  const tenantIds = new Map<TenantKey, string>();
  const roleIds = new Map<RoleKey, string>();
  const userIds = new Map<UserKey, string>();

  await prisma.$transaction(async (tx) => {
    for (const tenant of tenantSeeds) {
      const record = await tx.tenant.upsert({
        where: { id: tenant.id },
        update: {
          name: tenant.name,
          slug: tenant.slug,
        },
        create: {
          id: tenant.id,
          name: tenant.name,
          slug: tenant.slug,
        },
      });

      tenantIds.set(tenant.key, record.id);
    }

    for (const site of siteSeeds) {
      const tenantId = tenantIds.get(site.tenantKey);

      if (!tenantId) {
        throw new Error(`Missing tenant for site ${site.id}`);
      }

      await tx.site.upsert({
        where: {
          tenantId_slug: {
            tenantId,
            slug: site.slug,
          },
        },
        update: {
          name: site.name,
        },
        create: {
          id: site.id,
          tenantId,
          name: site.name,
          slug: site.slug,
        },
      });
    }

    for (const role of roleSeeds) {
      const tenantId = tenantIds.get(role.tenantKey);

      if (!tenantId) {
        throw new Error(`Missing tenant for role ${role.key}`);
      }

      const record = await tx.role.upsert({
        where: { id: role.id },
        update: {
          name: role.name,
          tenantId,
          permissions: role.permissions,
        },
        create: {
          id: role.id,
          name: role.name,
          tenantId,
          permissions: role.permissions,
        },
      });

      roleIds.set(role.key, record.id);
    }

    for (const user of userSeeds) {
      const record = await tx.user.upsert({
        where: { email: user.email },
        update: {
          passwordHash,
          isActive: user.isActive,
        },
        create: {
          id: user.id,
          email: user.email,
          passwordHash,
          isActive: user.isActive,
        },
      });

      userIds.set(user.key, record.id);
    }

    await tx.session.deleteMany({
      where: {
        userId: {
          in: [...userIds.values()],
        },
      },
    });

    for (const membership of membershipSeeds) {
      const tenantId = tenantIds.get(membership.tenantKey);
      const userId = userIds.get(membership.userKey);
      const roleId = roleIds.get(membership.roleKey);

      if (!tenantId || !userId || !roleId) {
        throw new Error(`Missing relation for membership ${membership.id}`);
      }

      await tx.tenantUser.upsert({
        where: {
          tenantId_userId: {
            tenantId,
            userId,
          },
        },
        update: {
          roleId,
        },
        create: {
          id: membership.id,
          tenantId,
          userId,
          roleId,
        },
      });
    }
  });

  console.log('Seed data created.');
  console.table([
    {
      email: 'admin@atlas.local',
      password: seedPassword,
      useCase: 'Multi-tenant login; should require tenant selection',
    },
    {
      email: 'editor@atlas.local',
      password: seedPassword,
      useCase: 'Single-tenant login; should go straight to dashboard',
    },
    {
      email: 'inactive@atlas.local',
      password: seedPassword,
      useCase: 'Inactive account; should be rejected',
    },
  ]);
}

main()
  .catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
