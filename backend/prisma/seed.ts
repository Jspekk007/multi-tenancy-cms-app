import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config({ path: '../.env', quiet: true });

const prisma = new PrismaClient();

const seedPassword = process.env.SEED_PASSWORD ?? 'Password123!';
const saltRounds = Number(process.env.SALT_ROUNDS ?? 10);
const dayInMs = 24 * 60 * 60 * 1000;

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
  {
    key: 'globalEditor',
    id: 'role_global_editor',
    tenantKey: 'globalProduction',
    name: 'EDITOR',
    permissions: ['content:read', 'content:create', 'content:update'],
  },
  {
    key: 'northwindEditor',
    id: 'role_northwind_editor',
    tenantKey: 'northwindEditorial',
    name: 'EDITOR',
    permissions: ['content:read', 'content:create', 'content:update'],
  },
  {
    key: 'acmeViewer',
    id: 'role_acme_viewer',
    tenantKey: 'acmeContentOps',
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
  {
    key: 'globalProducer',
    id: 'user_global_producer',
    email: 'producer@atlas.local',
    isActive: true,
  },
  {
    key: 'globalWriter',
    id: 'user_global_writer',
    email: 'writer@atlas.local',
    isActive: true,
  },
  {
    key: 'globalDesigner',
    id: 'user_global_designer',
    email: 'designer@atlas.local',
    isActive: true,
  },
  {
    key: 'globalAnalyst',
    id: 'user_global_analyst',
    email: 'analyst@atlas.local',
    isActive: true,
  },
  {
    key: 'northwindWriter',
    id: 'user_northwind_writer',
    email: 'northwind-writer@atlas.local',
    isActive: true,
  },
  {
    key: 'acmeDesigner',
    id: 'user_acme_designer',
    email: 'acme-designer@atlas.local',
    isActive: true,
  },
  {
    key: 'globalSeo',
    id: 'user_global_seo',
    email: 'seo@atlas.local',
    isActive: true,
  },
  {
    key: 'globalOps',
    id: 'user_global_ops',
    email: 'ops@atlas.local',
    isActive: true,
  },
  {
    key: 'northwindRecruiter',
    id: 'user_northwind_recruiter',
    email: 'recruiter@northwind.local',
    isActive: true,
  },
  {
    key: 'northwindDesigner',
    id: 'user_northwind_designer',
    email: 'designer@northwind.local',
    isActive: true,
  },
  {
    key: 'acmeStrategist',
    id: 'user_acme_strategist',
    email: 'strategist@acme.local',
    isActive: true,
  },
  {
    key: 'acmeWriter',
    id: 'user_acme_writer',
    email: 'writer@acme.local',
    isActive: true,
  },
  {
    key: 'acmeReviewer',
    id: 'user_acme_reviewer',
    email: 'reviewer@acme.local',
    isActive: true,
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
  {
    id: 'membership_global_producer',
    tenantKey: 'globalProduction',
    userKey: 'globalProducer',
    roleKey: 'globalEditor',
  },
  {
    id: 'membership_global_writer',
    tenantKey: 'globalProduction',
    userKey: 'globalWriter',
    roleKey: 'globalEditor',
  },
  {
    id: 'membership_global_designer',
    tenantKey: 'globalProduction',
    userKey: 'globalDesigner',
    roleKey: 'globalViewer',
  },
  {
    id: 'membership_global_analyst',
    tenantKey: 'globalProduction',
    userKey: 'globalAnalyst',
    roleKey: 'globalViewer',
  },
  {
    id: 'membership_northwind_writer',
    tenantKey: 'northwindEditorial',
    userKey: 'northwindWriter',
    roleKey: 'northwindAdmin',
  },
  {
    id: 'membership_acme_designer',
    tenantKey: 'acmeContentOps',
    userKey: 'acmeDesigner',
    roleKey: 'acmeEditor',
  },
  {
    id: 'membership_global_seo',
    tenantKey: 'globalProduction',
    userKey: 'globalSeo',
    roleKey: 'globalEditor',
  },
  {
    id: 'membership_global_ops',
    tenantKey: 'globalProduction',
    userKey: 'globalOps',
    roleKey: 'globalViewer',
  },
  {
    id: 'membership_northwind_recruiter',
    tenantKey: 'northwindEditorial',
    userKey: 'northwindRecruiter',
    roleKey: 'northwindEditor',
  },
  {
    id: 'membership_northwind_designer',
    tenantKey: 'northwindEditorial',
    userKey: 'northwindDesigner',
    roleKey: 'northwindEditor',
  },
  {
    id: 'membership_acme_strategist',
    tenantKey: 'acmeContentOps',
    userKey: 'acmeStrategist',
    roleKey: 'acmeEditor',
  },
  {
    id: 'membership_acme_writer',
    tenantKey: 'acmeContentOps',
    userKey: 'acmeWriter',
    roleKey: 'acmeEditor',
  },
  {
    id: 'membership_acme_reviewer',
    tenantKey: 'acmeContentOps',
    userKey: 'acmeReviewer',
    roleKey: 'acmeViewer',
  },
] as const;

type TenantKey = (typeof tenantSeeds)[number]['key'];
type SiteKey = (typeof siteSeeds)[number]['id'];
type RoleKey = (typeof roleSeeds)[number]['key'];
type UserKey = (typeof userSeeds)[number]['key'];
type MembershipLookupKey = `${TenantKey}:${UserKey}`;

const contentItemSeeds = [
  {
    id: 'content_global_launch_plan',
    tenantKey: 'globalProduction',
    siteId: 'site_global_marketing',
    title: 'Launch plan',
    status: 'PUBLISHED',
    createdByUserKey: 'globalProducer',
    updatedByUserKey: 'multiTenantAdmin',
    publishedByUserKey: 'multiTenantAdmin',
    createdDaysAgo: 18,
    updatedDaysAgo: 2,
    publishedDaysAgo: 1,
  },
  {
    id: 'content_global_editorial_calendar',
    tenantKey: 'globalProduction',
    siteId: 'site_global_marketing',
    title: 'Editorial calendar',
    status: 'DRAFT',
    createdByUserKey: 'globalWriter',
    updatedByUserKey: 'globalWriter',
    createdDaysAgo: 11,
    updatedDaysAgo: 3,
  },
  {
    id: 'content_global_docs_refresh',
    tenantKey: 'globalProduction',
    siteId: 'site_global_docs',
    title: 'Documentation refresh',
    status: 'PUBLISHED',
    createdByUserKey: 'globalProducer',
    updatedByUserKey: 'globalProducer',
    publishedByUserKey: 'globalProducer',
    createdDaysAgo: 8,
    updatedDaysAgo: 8,
    publishedDaysAgo: 6,
  },
  {
    id: 'content_northwind_spring_issue',
    tenantKey: 'northwindEditorial',
    siteId: 'site_northwind_editorial',
    title: 'Spring issue',
    status: 'PUBLISHED',
    createdByUserKey: 'northwindWriter',
    updatedByUserKey: 'multiTenantAdmin',
    publishedByUserKey: 'multiTenantAdmin',
    createdDaysAgo: 7,
    updatedDaysAgo: 4,
    publishedDaysAgo: 2,
  },
  {
    id: 'content_acme_campaign_brief',
    tenantKey: 'acmeContentOps',
    siteId: 'site_acme_campaigns',
    title: 'Campaign brief',
    status: 'DRAFT',
    createdByUserKey: 'singleTenantEditor',
    updatedByUserKey: 'acmeDesigner',
    createdDaysAgo: 6,
    updatedDaysAgo: 1,
  },
  {
    id: 'content_global_pricing_page',
    tenantKey: 'globalProduction',
    siteId: 'site_global_marketing',
    title: 'Pricing page',
    status: 'PUBLISHED',
    createdByUserKey: 'globalSeo',
    updatedByUserKey: 'globalSeo',
    publishedByUserKey: 'multiTenantAdmin',
    createdDaysAgo: 15,
    updatedDaysAgo: 5,
    publishedDaysAgo: 4,
  },
  {
    id: 'content_global_event_recap',
    tenantKey: 'globalProduction',
    siteId: 'site_global_marketing',
    title: 'Event recap',
    status: 'PUBLISHED',
    createdByUserKey: 'globalWriter',
    updatedByUserKey: 'globalDesigner',
    publishedByUserKey: 'globalProducer',
    createdDaysAgo: 9,
    updatedDaysAgo: 7,
    publishedDaysAgo: 7,
  },
  {
    id: 'content_global_api_reference',
    tenantKey: 'globalProduction',
    siteId: 'site_global_docs',
    title: 'API reference',
    status: 'DRAFT',
    createdByUserKey: 'globalProducer',
    updatedByUserKey: 'globalSeo',
    createdDaysAgo: 13,
    updatedDaysAgo: 2,
  },
  {
    id: 'content_global_migration_guide',
    tenantKey: 'globalProduction',
    siteId: 'site_global_docs',
    title: 'Migration guide',
    status: 'PUBLISHED',
    createdByUserKey: 'globalWriter',
    updatedByUserKey: 'globalProducer',
    publishedByUserKey: 'globalProducer',
    createdDaysAgo: 22,
    updatedDaysAgo: 12,
    publishedDaysAgo: 10,
  },
  {
    id: 'content_northwind_summer_issue',
    tenantKey: 'northwindEditorial',
    siteId: 'site_northwind_editorial',
    title: 'Summer issue',
    status: 'DRAFT',
    createdByUserKey: 'northwindWriter',
    updatedByUserKey: 'northwindDesigner',
    createdDaysAgo: 3,
    updatedDaysAgo: 1,
  },
  {
    id: 'content_northwind_interview_series',
    tenantKey: 'northwindEditorial',
    siteId: 'site_northwind_editorial',
    title: 'Interview series',
    status: 'PUBLISHED',
    createdByUserKey: 'northwindDesigner',
    updatedByUserKey: 'northwindWriter',
    publishedByUserKey: 'multiTenantAdmin',
    createdDaysAgo: 21,
    updatedDaysAgo: 9,
    publishedDaysAgo: 8,
  },
  {
    id: 'content_northwind_careers_landing',
    tenantKey: 'northwindEditorial',
    siteId: 'site_northwind_careers',
    title: 'Careers landing page',
    status: 'PUBLISHED',
    createdByUserKey: 'northwindRecruiter',
    updatedByUserKey: 'northwindRecruiter',
    publishedByUserKey: 'multiTenantAdmin',
    createdDaysAgo: 14,
    updatedDaysAgo: 6,
    publishedDaysAgo: 6,
  },
  {
    id: 'content_northwind_benefits_guide',
    tenantKey: 'northwindEditorial',
    siteId: 'site_northwind_careers',
    title: 'Benefits guide',
    status: 'DRAFT',
    createdByUserKey: 'northwindRecruiter',
    updatedByUserKey: 'northwindDesigner',
    createdDaysAgo: 10,
    updatedDaysAgo: 2,
  },
  {
    id: 'content_northwind_internship_post',
    tenantKey: 'northwindEditorial',
    siteId: 'site_northwind_careers',
    title: 'Internship post',
    status: 'PUBLISHED',
    createdByUserKey: 'northwindDesigner',
    updatedByUserKey: 'northwindRecruiter',
    publishedByUserKey: 'northwindRecruiter',
    createdDaysAgo: 5,
    updatedDaysAgo: 1,
    publishedDaysAgo: 1,
  },
  {
    id: 'content_acme_case_study',
    tenantKey: 'acmeContentOps',
    siteId: 'site_acme_content_hub',
    title: 'Manufacturing case study',
    status: 'PUBLISHED',
    createdByUserKey: 'acmeWriter',
    updatedByUserKey: 'acmeStrategist',
    publishedByUserKey: 'singleTenantEditor',
    createdDaysAgo: 16,
    updatedDaysAgo: 8,
    publishedDaysAgo: 8,
  },
  {
    id: 'content_acme_product_update',
    tenantKey: 'acmeContentOps',
    siteId: 'site_acme_content_hub',
    title: 'Product update',
    status: 'DRAFT',
    createdByUserKey: 'acmeStrategist',
    updatedByUserKey: 'acmeStrategist',
    createdDaysAgo: 4,
    updatedDaysAgo: 1,
  },
  {
    id: 'content_acme_customer_story',
    tenantKey: 'acmeContentOps',
    siteId: 'site_acme_content_hub',
    title: 'Customer story',
    status: 'PUBLISHED',
    createdByUserKey: 'acmeWriter',
    updatedByUserKey: 'acmeDesigner',
    publishedByUserKey: 'singleTenantEditor',
    createdDaysAgo: 27,
    updatedDaysAgo: 11,
    publishedDaysAgo: 9,
  },
  {
    id: 'content_acme_social_calendar',
    tenantKey: 'acmeContentOps',
    siteId: 'site_acme_campaigns',
    title: 'Social calendar',
    status: 'DRAFT',
    createdByUserKey: 'acmeWriter',
    updatedByUserKey: 'acmeDesigner',
    createdDaysAgo: 12,
    updatedDaysAgo: 2,
  },
  {
    id: 'content_acme_q3_launch',
    tenantKey: 'acmeContentOps',
    siteId: 'site_acme_campaigns',
    title: 'Q3 launch',
    status: 'PUBLISHED',
    createdByUserKey: 'acmeStrategist',
    updatedByUserKey: 'singleTenantEditor',
    publishedByUserKey: 'singleTenantEditor',
    createdDaysAgo: 20,
    updatedDaysAgo: 1,
    publishedDaysAgo: 1,
  },
] as const;

const assetSeeds = [
  {
    id: 'asset_global_hero',
    tenantKey: 'globalProduction',
    siteId: 'site_global_marketing',
    fileName: 'hero.jpg',
    mimeType: 'image/jpeg',
    byteSize: 4_194_304n,
    storageKey: 'global-production/hero.jpg',
    uploadedByUserKey: 'globalDesigner',
    createdDaysAgo: 5,
  },
  {
    id: 'asset_global_whitepaper',
    tenantKey: 'globalProduction',
    siteId: 'site_global_docs',
    fileName: 'whitepaper.pdf',
    mimeType: 'application/pdf',
    byteSize: 8_388_608n,
    storageKey: 'global-production/whitepaper.pdf',
    uploadedByUserKey: 'globalProducer',
    createdDaysAgo: 3,
  },
  {
    id: 'asset_northwind_cover',
    tenantKey: 'northwindEditorial',
    siteId: 'site_northwind_editorial',
    fileName: 'cover.png',
    mimeType: 'image/png',
    byteSize: 2_097_152n,
    storageKey: 'northwind-editorial/cover.png',
    uploadedByUserKey: 'northwindWriter',
    createdDaysAgo: 2,
  },
  {
    id: 'asset_acme_banner',
    tenantKey: 'acmeContentOps',
    siteId: 'site_acme_campaigns',
    fileName: 'banner.png',
    mimeType: 'image/png',
    byteSize: 1_048_576n,
    storageKey: 'acme-content-ops/banner.png',
    uploadedByUserKey: 'acmeDesigner',
    createdDaysAgo: 8,
  },
  {
    id: 'asset_global_pricing_chart',
    tenantKey: 'globalProduction',
    siteId: 'site_global_marketing',
    fileName: 'pricing-chart.png',
    mimeType: 'image/png',
    byteSize: 1_572_864n,
    storageKey: 'global-production/pricing-chart.png',
    uploadedByUserKey: 'globalSeo',
    createdDaysAgo: 4,
  },
  {
    id: 'asset_global_event_photos',
    tenantKey: 'globalProduction',
    siteId: 'site_global_marketing',
    fileName: 'event-photos.zip',
    mimeType: 'application/zip',
    byteSize: 6_291_456n,
    storageKey: 'global-production/event-photos.zip',
    uploadedByUserKey: 'globalDesigner',
    createdDaysAgo: 7,
  },
  {
    id: 'asset_global_api_collection',
    tenantKey: 'globalProduction',
    siteId: 'site_global_docs',
    fileName: 'api-collection.json',
    mimeType: 'application/json',
    byteSize: 524_288n,
    storageKey: 'global-production/api-collection.json',
    uploadedByUserKey: 'globalProducer',
    createdDaysAgo: 2,
  },
  {
    id: 'asset_global_migration_diagram',
    tenantKey: 'globalProduction',
    siteId: 'site_global_docs',
    fileName: 'migration-diagram.svg',
    mimeType: 'image/svg+xml',
    byteSize: 786_432n,
    storageKey: 'global-production/migration-diagram.svg',
    uploadedByUserKey: 'globalSeo',
    createdDaysAgo: 10,
  },
  {
    id: 'asset_northwind_interview_audio',
    tenantKey: 'northwindEditorial',
    siteId: 'site_northwind_editorial',
    fileName: 'interview-audio.mp3',
    mimeType: 'audio/mpeg',
    byteSize: 25_165_824n,
    storageKey: 'northwind-editorial/interview-audio.mp3',
    uploadedByUserKey: 'northwindWriter',
    createdDaysAgo: 8,
  },
  {
    id: 'asset_northwind_team_photo',
    tenantKey: 'northwindEditorial',
    siteId: 'site_northwind_careers',
    fileName: 'team-photo.jpg',
    mimeType: 'image/jpeg',
    byteSize: 3_145_728n,
    storageKey: 'northwind-editorial/team-photo.jpg',
    uploadedByUserKey: 'northwindDesigner',
    createdDaysAgo: 6,
  },
  {
    id: 'asset_northwind_benefits_pdf',
    tenantKey: 'northwindEditorial',
    siteId: 'site_northwind_careers',
    fileName: 'benefits.pdf',
    mimeType: 'application/pdf',
    byteSize: 1_310_720n,
    storageKey: 'northwind-editorial/benefits.pdf',
    uploadedByUserKey: 'northwindRecruiter',
    createdDaysAgo: 2,
  },
  {
    id: 'asset_acme_case_study_images',
    tenantKey: 'acmeContentOps',
    siteId: 'site_acme_content_hub',
    fileName: 'case-study-images.zip',
    mimeType: 'application/zip',
    byteSize: 5_242_880n,
    storageKey: 'acme-content-ops/case-study-images.zip',
    uploadedByUserKey: 'acmeDesigner',
    createdDaysAgo: 8,
  },
  {
    id: 'asset_acme_product_screens',
    tenantKey: 'acmeContentOps',
    siteId: 'site_acme_content_hub',
    fileName: 'product-screens.png',
    mimeType: 'image/png',
    byteSize: 2_621_440n,
    storageKey: 'acme-content-ops/product-screens.png',
    uploadedByUserKey: 'acmeStrategist',
    createdDaysAgo: 1,
  },
  {
    id: 'asset_acme_campaign_video',
    tenantKey: 'acmeContentOps',
    siteId: 'site_acme_campaigns',
    fileName: 'campaign-video.mp4',
    mimeType: 'video/mp4',
    byteSize: 18_874_368n,
    storageKey: 'acme-content-ops/campaign-video.mp4',
    uploadedByUserKey: 'acmeDesigner',
    createdDaysAgo: 2,
  },
  {
    id: 'asset_acme_social_assets',
    tenantKey: 'acmeContentOps',
    siteId: 'site_acme_campaigns',
    fileName: 'social-assets.zip',
    mimeType: 'application/zip',
    byteSize: 4_718_592n,
    storageKey: 'acme-content-ops/social-assets.zip',
    uploadedByUserKey: 'acmeWriter',
    createdDaysAgo: 1,
  },
] as const;

const activityEventSeeds = [
  {
    id: 'activity_global_launch_created',
    tenantKey: 'globalProduction',
    siteId: 'site_global_marketing',
    actorUserKey: 'globalProducer',
    type: 'CONTENT_CREATED',
    entityType: 'content',
    entityId: 'content_global_launch_plan',
    description: 'created Launch plan',
    daysAgo: 18,
  },
  {
    id: 'activity_global_calendar_created',
    tenantKey: 'globalProduction',
    siteId: 'site_global_marketing',
    actorUserKey: 'globalWriter',
    type: 'CONTENT_CREATED',
    entityType: 'content',
    entityId: 'content_global_editorial_calendar',
    description: 'created Editorial calendar',
    daysAgo: 11,
  },
  {
    id: 'activity_global_docs_created',
    tenantKey: 'globalProduction',
    siteId: 'site_global_docs',
    actorUserKey: 'globalProducer',
    type: 'CONTENT_CREATED',
    entityType: 'content',
    entityId: 'content_global_docs_refresh',
    description: 'created Documentation refresh',
    daysAgo: 8,
  },
  {
    id: 'activity_global_docs_published',
    tenantKey: 'globalProduction',
    siteId: 'site_global_docs',
    actorUserKey: 'globalProducer',
    type: 'CONTENT_PUBLISHED',
    entityType: 'content',
    entityId: 'content_global_docs_refresh',
    description: 'published Documentation refresh',
    daysAgo: 6,
  },
  {
    id: 'activity_global_hero_uploaded',
    tenantKey: 'globalProduction',
    siteId: 'site_global_marketing',
    actorUserKey: 'globalDesigner',
    type: 'ASSET_UPLOADED',
    entityType: 'asset',
    entityId: 'asset_global_hero',
    description: 'uploaded hero.jpg',
    daysAgo: 5,
  },
  {
    id: 'activity_global_calendar_updated',
    tenantKey: 'globalProduction',
    siteId: 'site_global_marketing',
    actorUserKey: 'globalWriter',
    type: 'CONTENT_UPDATED',
    entityType: 'content',
    entityId: 'content_global_editorial_calendar',
    description: 'updated Editorial calendar',
    daysAgo: 3,
  },
  {
    id: 'activity_global_whitepaper_uploaded',
    tenantKey: 'globalProduction',
    siteId: 'site_global_docs',
    actorUserKey: 'globalProducer',
    type: 'ASSET_UPLOADED',
    entityType: 'asset',
    entityId: 'asset_global_whitepaper',
    description: 'uploaded whitepaper.pdf',
    daysAgo: 3,
  },
  {
    id: 'activity_global_launch_updated',
    tenantKey: 'globalProduction',
    siteId: 'site_global_marketing',
    actorUserKey: 'multiTenantAdmin',
    type: 'CONTENT_UPDATED',
    entityType: 'content',
    entityId: 'content_global_launch_plan',
    description: 'updated Launch plan',
    daysAgo: 2,
  },
  {
    id: 'activity_global_launch_published',
    tenantKey: 'globalProduction',
    siteId: 'site_global_marketing',
    actorUserKey: 'multiTenantAdmin',
    type: 'CONTENT_PUBLISHED',
    entityType: 'content',
    entityId: 'content_global_launch_plan',
    description: 'published Launch plan',
    daysAgo: 1,
  },
  {
    id: 'activity_global_archive_old',
    tenantKey: 'globalProduction',
    siteId: 'site_global_marketing',
    actorUserKey: 'multiTenantAdmin',
    type: 'CONTENT_UPDATED',
    entityType: 'content',
    entityId: 'content_global_launch_plan',
    description: 'updated archived launch notes',
    daysAgo: 45,
  },
  {
    id: 'activity_northwind_issue_created',
    tenantKey: 'northwindEditorial',
    siteId: 'site_northwind_editorial',
    actorUserKey: 'northwindWriter',
    type: 'CONTENT_CREATED',
    entityType: 'content',
    entityId: 'content_northwind_spring_issue',
    description: 'created Spring issue',
    daysAgo: 7,
  },
  {
    id: 'activity_northwind_issue_updated',
    tenantKey: 'northwindEditorial',
    siteId: 'site_northwind_editorial',
    actorUserKey: 'multiTenantAdmin',
    type: 'CONTENT_UPDATED',
    entityType: 'content',
    entityId: 'content_northwind_spring_issue',
    description: 'updated Spring issue',
    daysAgo: 4,
  },
  {
    id: 'activity_northwind_issue_published',
    tenantKey: 'northwindEditorial',
    siteId: 'site_northwind_editorial',
    actorUserKey: 'multiTenantAdmin',
    type: 'CONTENT_PUBLISHED',
    entityType: 'content',
    entityId: 'content_northwind_spring_issue',
    description: 'published Spring issue',
    daysAgo: 2,
  },
  {
    id: 'activity_acme_brief_created',
    tenantKey: 'acmeContentOps',
    siteId: 'site_acme_campaigns',
    actorUserKey: 'singleTenantEditor',
    type: 'CONTENT_CREATED',
    entityType: 'content',
    entityId: 'content_acme_campaign_brief',
    description: 'created Campaign brief',
    daysAgo: 6,
  },
  {
    id: 'activity_acme_brief_updated',
    tenantKey: 'acmeContentOps',
    siteId: 'site_acme_campaigns',
    actorUserKey: 'acmeDesigner',
    type: 'CONTENT_UPDATED',
    entityType: 'content',
    entityId: 'content_acme_campaign_brief',
    description: 'updated Campaign brief',
    daysAgo: 1,
  },
  {
    id: 'activity_global_pricing_created',
    tenantKey: 'globalProduction',
    siteId: 'site_global_marketing',
    actorUserKey: 'globalSeo',
    type: 'CONTENT_CREATED',
    entityType: 'content',
    entityId: 'content_global_pricing_page',
    description: 'created Pricing page',
    daysAgo: 15,
  },
  {
    id: 'activity_global_pricing_updated',
    tenantKey: 'globalProduction',
    siteId: 'site_global_marketing',
    actorUserKey: 'globalSeo',
    type: 'CONTENT_UPDATED',
    entityType: 'content',
    entityId: 'content_global_pricing_page',
    description: 'updated Pricing page',
    daysAgo: 5,
  },
  {
    id: 'activity_global_pricing_published',
    tenantKey: 'globalProduction',
    siteId: 'site_global_marketing',
    actorUserKey: 'multiTenantAdmin',
    type: 'CONTENT_PUBLISHED',
    entityType: 'content',
    entityId: 'content_global_pricing_page',
    description: 'published Pricing page',
    daysAgo: 4,
  },
  {
    id: 'activity_global_event_recap_created',
    tenantKey: 'globalProduction',
    siteId: 'site_global_marketing',
    actorUserKey: 'globalWriter',
    type: 'CONTENT_CREATED',
    entityType: 'content',
    entityId: 'content_global_event_recap',
    description: 'created Event recap',
    daysAgo: 9,
  },
  {
    id: 'activity_global_event_recap_updated',
    tenantKey: 'globalProduction',
    siteId: 'site_global_marketing',
    actorUserKey: 'globalDesigner',
    type: 'CONTENT_UPDATED',
    entityType: 'content',
    entityId: 'content_global_event_recap',
    description: 'updated Event recap',
    daysAgo: 7,
  },
  {
    id: 'activity_global_event_recap_published',
    tenantKey: 'globalProduction',
    siteId: 'site_global_marketing',
    actorUserKey: 'globalProducer',
    type: 'CONTENT_PUBLISHED',
    entityType: 'content',
    entityId: 'content_global_event_recap',
    description: 'published Event recap',
    daysAgo: 7,
  },
  {
    id: 'activity_global_pricing_chart_uploaded',
    tenantKey: 'globalProduction',
    siteId: 'site_global_marketing',
    actorUserKey: 'globalSeo',
    type: 'ASSET_UPLOADED',
    entityType: 'asset',
    entityId: 'asset_global_pricing_chart',
    description: 'uploaded pricing-chart.png',
    daysAgo: 4,
  },
  {
    id: 'activity_global_event_photos_uploaded',
    tenantKey: 'globalProduction',
    siteId: 'site_global_marketing',
    actorUserKey: 'globalDesigner',
    type: 'ASSET_UPLOADED',
    entityType: 'asset',
    entityId: 'asset_global_event_photos',
    description: 'uploaded event-photos.zip',
    daysAgo: 7,
  },
  {
    id: 'activity_global_ops_reviewed_launch',
    tenantKey: 'globalProduction',
    siteId: 'site_global_marketing',
    actorUserKey: 'globalOps',
    type: 'MEMBER_ACTIVE',
    entityType: null,
    entityId: null,
    description: 'reviewed launch updates',
    daysAgo: 1,
  },
  {
    id: 'activity_global_api_reference_created',
    tenantKey: 'globalProduction',
    siteId: 'site_global_docs',
    actorUserKey: 'globalProducer',
    type: 'CONTENT_CREATED',
    entityType: 'content',
    entityId: 'content_global_api_reference',
    description: 'created API reference',
    daysAgo: 13,
  },
  {
    id: 'activity_global_api_reference_updated',
    tenantKey: 'globalProduction',
    siteId: 'site_global_docs',
    actorUserKey: 'globalSeo',
    type: 'CONTENT_UPDATED',
    entityType: 'content',
    entityId: 'content_global_api_reference',
    description: 'updated API reference',
    daysAgo: 2,
  },
  {
    id: 'activity_global_migration_guide_created',
    tenantKey: 'globalProduction',
    siteId: 'site_global_docs',
    actorUserKey: 'globalWriter',
    type: 'CONTENT_CREATED',
    entityType: 'content',
    entityId: 'content_global_migration_guide',
    description: 'created Migration guide',
    daysAgo: 22,
  },
  {
    id: 'activity_global_migration_guide_updated',
    tenantKey: 'globalProduction',
    siteId: 'site_global_docs',
    actorUserKey: 'globalProducer',
    type: 'CONTENT_UPDATED',
    entityType: 'content',
    entityId: 'content_global_migration_guide',
    description: 'updated Migration guide',
    daysAgo: 12,
  },
  {
    id: 'activity_global_migration_guide_published',
    tenantKey: 'globalProduction',
    siteId: 'site_global_docs',
    actorUserKey: 'globalProducer',
    type: 'CONTENT_PUBLISHED',
    entityType: 'content',
    entityId: 'content_global_migration_guide',
    description: 'published Migration guide',
    daysAgo: 10,
  },
  {
    id: 'activity_global_api_collection_uploaded',
    tenantKey: 'globalProduction',
    siteId: 'site_global_docs',
    actorUserKey: 'globalProducer',
    type: 'ASSET_UPLOADED',
    entityType: 'asset',
    entityId: 'asset_global_api_collection',
    description: 'uploaded api-collection.json',
    daysAgo: 2,
  },
  {
    id: 'activity_global_migration_diagram_uploaded',
    tenantKey: 'globalProduction',
    siteId: 'site_global_docs',
    actorUserKey: 'globalSeo',
    type: 'ASSET_UPLOADED',
    entityType: 'asset',
    entityId: 'asset_global_migration_diagram',
    description: 'uploaded migration-diagram.svg',
    daysAgo: 10,
  },
  {
    id: 'activity_global_ops_reviewed_docs',
    tenantKey: 'globalProduction',
    siteId: 'site_global_docs',
    actorUserKey: 'globalOps',
    type: 'MEMBER_ACTIVE',
    entityType: null,
    entityId: null,
    description: 'reviewed documentation updates',
    daysAgo: 1,
  },
  {
    id: 'activity_northwind_summer_created',
    tenantKey: 'northwindEditorial',
    siteId: 'site_northwind_editorial',
    actorUserKey: 'northwindWriter',
    type: 'CONTENT_CREATED',
    entityType: 'content',
    entityId: 'content_northwind_summer_issue',
    description: 'created Summer issue',
    daysAgo: 3,
  },
  {
    id: 'activity_northwind_summer_updated',
    tenantKey: 'northwindEditorial',
    siteId: 'site_northwind_editorial',
    actorUserKey: 'northwindDesigner',
    type: 'CONTENT_UPDATED',
    entityType: 'content',
    entityId: 'content_northwind_summer_issue',
    description: 'updated Summer issue',
    daysAgo: 1,
  },
  {
    id: 'activity_northwind_interview_created',
    tenantKey: 'northwindEditorial',
    siteId: 'site_northwind_editorial',
    actorUserKey: 'northwindDesigner',
    type: 'CONTENT_CREATED',
    entityType: 'content',
    entityId: 'content_northwind_interview_series',
    description: 'created Interview series',
    daysAgo: 21,
  },
  {
    id: 'activity_northwind_interview_updated',
    tenantKey: 'northwindEditorial',
    siteId: 'site_northwind_editorial',
    actorUserKey: 'northwindWriter',
    type: 'CONTENT_UPDATED',
    entityType: 'content',
    entityId: 'content_northwind_interview_series',
    description: 'updated Interview series',
    daysAgo: 9,
  },
  {
    id: 'activity_northwind_interview_published',
    tenantKey: 'northwindEditorial',
    siteId: 'site_northwind_editorial',
    actorUserKey: 'multiTenantAdmin',
    type: 'CONTENT_PUBLISHED',
    entityType: 'content',
    entityId: 'content_northwind_interview_series',
    description: 'published Interview series',
    daysAgo: 8,
  },
  {
    id: 'activity_northwind_interview_audio_uploaded',
    tenantKey: 'northwindEditorial',
    siteId: 'site_northwind_editorial',
    actorUserKey: 'northwindWriter',
    type: 'ASSET_UPLOADED',
    entityType: 'asset',
    entityId: 'asset_northwind_interview_audio',
    description: 'uploaded interview-audio.mp3',
    daysAgo: 8,
  },
  {
    id: 'activity_northwind_careers_created',
    tenantKey: 'northwindEditorial',
    siteId: 'site_northwind_careers',
    actorUserKey: 'northwindRecruiter',
    type: 'CONTENT_CREATED',
    entityType: 'content',
    entityId: 'content_northwind_careers_landing',
    description: 'created Careers landing page',
    daysAgo: 14,
  },
  {
    id: 'activity_northwind_careers_updated',
    tenantKey: 'northwindEditorial',
    siteId: 'site_northwind_careers',
    actorUserKey: 'northwindRecruiter',
    type: 'CONTENT_UPDATED',
    entityType: 'content',
    entityId: 'content_northwind_careers_landing',
    description: 'updated Careers landing page',
    daysAgo: 6,
  },
  {
    id: 'activity_northwind_careers_published',
    tenantKey: 'northwindEditorial',
    siteId: 'site_northwind_careers',
    actorUserKey: 'multiTenantAdmin',
    type: 'CONTENT_PUBLISHED',
    entityType: 'content',
    entityId: 'content_northwind_careers_landing',
    description: 'published Careers landing page',
    daysAgo: 6,
  },
  {
    id: 'activity_northwind_benefits_created',
    tenantKey: 'northwindEditorial',
    siteId: 'site_northwind_careers',
    actorUserKey: 'northwindRecruiter',
    type: 'CONTENT_CREATED',
    entityType: 'content',
    entityId: 'content_northwind_benefits_guide',
    description: 'created Benefits guide',
    daysAgo: 10,
  },
  {
    id: 'activity_northwind_benefits_updated',
    tenantKey: 'northwindEditorial',
    siteId: 'site_northwind_careers',
    actorUserKey: 'northwindDesigner',
    type: 'CONTENT_UPDATED',
    entityType: 'content',
    entityId: 'content_northwind_benefits_guide',
    description: 'updated Benefits guide',
    daysAgo: 2,
  },
  {
    id: 'activity_northwind_internship_created',
    tenantKey: 'northwindEditorial',
    siteId: 'site_northwind_careers',
    actorUserKey: 'northwindDesigner',
    type: 'CONTENT_CREATED',
    entityType: 'content',
    entityId: 'content_northwind_internship_post',
    description: 'created Internship post',
    daysAgo: 5,
  },
  {
    id: 'activity_northwind_internship_updated',
    tenantKey: 'northwindEditorial',
    siteId: 'site_northwind_careers',
    actorUserKey: 'northwindRecruiter',
    type: 'CONTENT_UPDATED',
    entityType: 'content',
    entityId: 'content_northwind_internship_post',
    description: 'updated Internship post',
    daysAgo: 1,
  },
  {
    id: 'activity_northwind_internship_published',
    tenantKey: 'northwindEditorial',
    siteId: 'site_northwind_careers',
    actorUserKey: 'northwindRecruiter',
    type: 'CONTENT_PUBLISHED',
    entityType: 'content',
    entityId: 'content_northwind_internship_post',
    description: 'published Internship post',
    daysAgo: 1,
  },
  {
    id: 'activity_northwind_team_photo_uploaded',
    tenantKey: 'northwindEditorial',
    siteId: 'site_northwind_careers',
    actorUserKey: 'northwindDesigner',
    type: 'ASSET_UPLOADED',
    entityType: 'asset',
    entityId: 'asset_northwind_team_photo',
    description: 'uploaded team-photo.jpg',
    daysAgo: 6,
  },
  {
    id: 'activity_northwind_benefits_pdf_uploaded',
    tenantKey: 'northwindEditorial',
    siteId: 'site_northwind_careers',
    actorUserKey: 'northwindRecruiter',
    type: 'ASSET_UPLOADED',
    entityType: 'asset',
    entityId: 'asset_northwind_benefits_pdf',
    description: 'uploaded benefits.pdf',
    daysAgo: 2,
  },
  {
    id: 'activity_acme_case_study_created',
    tenantKey: 'acmeContentOps',
    siteId: 'site_acme_content_hub',
    actorUserKey: 'acmeWriter',
    type: 'CONTENT_CREATED',
    entityType: 'content',
    entityId: 'content_acme_case_study',
    description: 'created Manufacturing case study',
    daysAgo: 16,
  },
  {
    id: 'activity_acme_case_study_updated',
    tenantKey: 'acmeContentOps',
    siteId: 'site_acme_content_hub',
    actorUserKey: 'acmeStrategist',
    type: 'CONTENT_UPDATED',
    entityType: 'content',
    entityId: 'content_acme_case_study',
    description: 'updated Manufacturing case study',
    daysAgo: 8,
  },
  {
    id: 'activity_acme_case_study_published',
    tenantKey: 'acmeContentOps',
    siteId: 'site_acme_content_hub',
    actorUserKey: 'singleTenantEditor',
    type: 'CONTENT_PUBLISHED',
    entityType: 'content',
    entityId: 'content_acme_case_study',
    description: 'published Manufacturing case study',
    daysAgo: 8,
  },
  {
    id: 'activity_acme_product_update_created',
    tenantKey: 'acmeContentOps',
    siteId: 'site_acme_content_hub',
    actorUserKey: 'acmeStrategist',
    type: 'CONTENT_CREATED',
    entityType: 'content',
    entityId: 'content_acme_product_update',
    description: 'created Product update',
    daysAgo: 4,
  },
  {
    id: 'activity_acme_product_update_updated',
    tenantKey: 'acmeContentOps',
    siteId: 'site_acme_content_hub',
    actorUserKey: 'acmeStrategist',
    type: 'CONTENT_UPDATED',
    entityType: 'content',
    entityId: 'content_acme_product_update',
    description: 'updated Product update',
    daysAgo: 1,
  },
  {
    id: 'activity_acme_customer_story_created',
    tenantKey: 'acmeContentOps',
    siteId: 'site_acme_content_hub',
    actorUserKey: 'acmeWriter',
    type: 'CONTENT_CREATED',
    entityType: 'content',
    entityId: 'content_acme_customer_story',
    description: 'created Customer story',
    daysAgo: 27,
  },
  {
    id: 'activity_acme_customer_story_updated',
    tenantKey: 'acmeContentOps',
    siteId: 'site_acme_content_hub',
    actorUserKey: 'acmeDesigner',
    type: 'CONTENT_UPDATED',
    entityType: 'content',
    entityId: 'content_acme_customer_story',
    description: 'updated Customer story',
    daysAgo: 11,
  },
  {
    id: 'activity_acme_customer_story_published',
    tenantKey: 'acmeContentOps',
    siteId: 'site_acme_content_hub',
    actorUserKey: 'singleTenantEditor',
    type: 'CONTENT_PUBLISHED',
    entityType: 'content',
    entityId: 'content_acme_customer_story',
    description: 'published Customer story',
    daysAgo: 9,
  },
  {
    id: 'activity_acme_case_study_images_uploaded',
    tenantKey: 'acmeContentOps',
    siteId: 'site_acme_content_hub',
    actorUserKey: 'acmeDesigner',
    type: 'ASSET_UPLOADED',
    entityType: 'asset',
    entityId: 'asset_acme_case_study_images',
    description: 'uploaded case-study-images.zip',
    daysAgo: 8,
  },
  {
    id: 'activity_acme_product_screens_uploaded',
    tenantKey: 'acmeContentOps',
    siteId: 'site_acme_content_hub',
    actorUserKey: 'acmeStrategist',
    type: 'ASSET_UPLOADED',
    entityType: 'asset',
    entityId: 'asset_acme_product_screens',
    description: 'uploaded product-screens.png',
    daysAgo: 1,
  },
  {
    id: 'activity_acme_reviewer_checked_hub',
    tenantKey: 'acmeContentOps',
    siteId: 'site_acme_content_hub',
    actorUserKey: 'acmeReviewer',
    type: 'MEMBER_ACTIVE',
    entityType: null,
    entityId: null,
    description: 'reviewed content hub updates',
    daysAgo: 2,
  },
  {
    id: 'activity_acme_social_calendar_created',
    tenantKey: 'acmeContentOps',
    siteId: 'site_acme_campaigns',
    actorUserKey: 'acmeWriter',
    type: 'CONTENT_CREATED',
    entityType: 'content',
    entityId: 'content_acme_social_calendar',
    description: 'created Social calendar',
    daysAgo: 12,
  },
  {
    id: 'activity_acme_social_calendar_updated',
    tenantKey: 'acmeContentOps',
    siteId: 'site_acme_campaigns',
    actorUserKey: 'acmeDesigner',
    type: 'CONTENT_UPDATED',
    entityType: 'content',
    entityId: 'content_acme_social_calendar',
    description: 'updated Social calendar',
    daysAgo: 2,
  },
  {
    id: 'activity_acme_q3_launch_created',
    tenantKey: 'acmeContentOps',
    siteId: 'site_acme_campaigns',
    actorUserKey: 'acmeStrategist',
    type: 'CONTENT_CREATED',
    entityType: 'content',
    entityId: 'content_acme_q3_launch',
    description: 'created Q3 launch',
    daysAgo: 20,
  },
  {
    id: 'activity_acme_q3_launch_updated',
    tenantKey: 'acmeContentOps',
    siteId: 'site_acme_campaigns',
    actorUserKey: 'singleTenantEditor',
    type: 'CONTENT_UPDATED',
    entityType: 'content',
    entityId: 'content_acme_q3_launch',
    description: 'updated Q3 launch',
    daysAgo: 1,
  },
  {
    id: 'activity_acme_q3_launch_published',
    tenantKey: 'acmeContentOps',
    siteId: 'site_acme_campaigns',
    actorUserKey: 'singleTenantEditor',
    type: 'CONTENT_PUBLISHED',
    entityType: 'content',
    entityId: 'content_acme_q3_launch',
    description: 'published Q3 launch',
    daysAgo: 1,
  },
  {
    id: 'activity_acme_campaign_video_uploaded',
    tenantKey: 'acmeContentOps',
    siteId: 'site_acme_campaigns',
    actorUserKey: 'acmeDesigner',
    type: 'ASSET_UPLOADED',
    entityType: 'asset',
    entityId: 'asset_acme_campaign_video',
    description: 'uploaded campaign-video.mp4',
    daysAgo: 2,
  },
  {
    id: 'activity_acme_social_assets_uploaded',
    tenantKey: 'acmeContentOps',
    siteId: 'site_acme_campaigns',
    actorUserKey: 'acmeWriter',
    type: 'ASSET_UPLOADED',
    entityType: 'asset',
    entityId: 'asset_acme_social_assets',
    description: 'uploaded social-assets.zip',
    daysAgo: 1,
  },
  {
    id: 'activity_acme_reviewer_checked_campaigns',
    tenantKey: 'acmeContentOps',
    siteId: 'site_acme_campaigns',
    actorUserKey: 'acmeReviewer',
    type: 'MEMBER_ACTIVE',
    entityType: null,
    entityId: null,
    description: 'reviewed campaign updates',
    daysAgo: 1,
  },
] as const;

async function main(): Promise<void> {
  const passwordHash = await bcrypt.hash(seedPassword, saltRounds);
  const seedNow = new Date();
  const daysAgo = (days: number): Date => new Date(seedNow.getTime() - days * dayInMs);
  const tenantIds = new Map<TenantKey, string>();
  const siteIds = new Map<SiteKey, string>();
  const roleIds = new Map<RoleKey, string>();
  const userIds = new Map<UserKey, string>();
  const membershipIds = new Map<MembershipLookupKey, string>();

  await prisma.$transaction(
    async (tx) => {
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

        const record = await tx.site.upsert({
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

        siteIds.set(site.id, record.id);
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

        const record = await tx.tenantUser.upsert({
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

        membershipIds.set(`${membership.tenantKey}:${membership.userKey}`, record.id);
      }

      await tx.activityEvent.deleteMany({
        where: {
          id: {
            in: activityEventSeeds.map((activity) => activity.id),
          },
        },
      });

      await tx.asset.deleteMany({
        where: {
          id: {
            in: assetSeeds.map((asset) => asset.id),
          },
        },
      });

      await tx.contentItem.deleteMany({
        where: {
          id: {
            in: contentItemSeeds.map((contentItem) => contentItem.id),
          },
        },
      });

      for (const contentItem of contentItemSeeds) {
        const tenantId = tenantIds.get(contentItem.tenantKey);
        const siteId = siteIds.get(contentItem.siteId);
        const createdByTenantUserId = membershipIds.get(
          `${contentItem.tenantKey}:${contentItem.createdByUserKey}`,
        );
        const updatedByTenantUserId = membershipIds.get(
          `${contentItem.tenantKey}:${contentItem.updatedByUserKey}`,
        );
        const publishedByTenantUserId =
          'publishedByUserKey' in contentItem
            ? membershipIds.get(`${contentItem.tenantKey}:${contentItem.publishedByUserKey}`)
            : undefined;
        const publishedAt =
          'publishedDaysAgo' in contentItem ? daysAgo(contentItem.publishedDaysAgo) : undefined;

        if (!tenantId || !siteId || !createdByTenantUserId || !updatedByTenantUserId) {
          throw new Error(`Missing relation for content item ${contentItem.id}`);
        }

        if ('publishedByUserKey' in contentItem && !publishedByTenantUserId) {
          throw new Error(`Missing publisher for content item ${contentItem.id}`);
        }

        await tx.contentItem.create({
          data: {
            id: contentItem.id,
            tenantId,
            siteId,
            title: contentItem.title,
            status: contentItem.status,
            createdByTenantUserId,
            updatedByTenantUserId,
            publishedByTenantUserId: publishedByTenantUserId ?? null,
            publishedAt: publishedAt ?? null,
            createdAt: daysAgo(contentItem.createdDaysAgo),
            updatedAt: daysAgo(contentItem.updatedDaysAgo),
          },
        });
      }

      for (const asset of assetSeeds) {
        const tenantId = tenantIds.get(asset.tenantKey);
        const siteId = siteIds.get(asset.siteId);
        const uploadedByTenantUserId = membershipIds.get(
          `${asset.tenantKey}:${asset.uploadedByUserKey}`,
        );

        if (!tenantId || !siteId || !uploadedByTenantUserId) {
          throw new Error(`Missing relation for asset ${asset.id}`);
        }

        await tx.asset.create({
          data: {
            id: asset.id,
            tenantId,
            siteId,
            fileName: asset.fileName,
            mimeType: asset.mimeType,
            byteSize: asset.byteSize,
            storageKey: asset.storageKey,
            uploadedByTenantUserId,
            createdAt: daysAgo(asset.createdDaysAgo),
            updatedAt: daysAgo(asset.createdDaysAgo),
          },
        });
      }

      for (const activity of activityEventSeeds) {
        const tenantId = tenantIds.get(activity.tenantKey);
        const siteId = siteIds.get(activity.siteId);
        const actorTenantUserId = membershipIds.get(
          `${activity.tenantKey}:${activity.actorUserKey}`,
        );

        if (!tenantId || !siteId || !actorTenantUserId) {
          throw new Error(`Missing relation for activity event ${activity.id}`);
        }

        await tx.activityEvent.create({
          data: {
            id: activity.id,
            tenantId,
            siteId,
            actorTenantUserId,
            type: activity.type,
            entityType: activity.entityType,
            entityId: activity.entityId,
            description: activity.description,
            createdAt: daysAgo(activity.daysAgo),
          },
        });
      }
    },
    {
      maxWait: 10_000,
      timeout: 60_000,
    },
  );

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
