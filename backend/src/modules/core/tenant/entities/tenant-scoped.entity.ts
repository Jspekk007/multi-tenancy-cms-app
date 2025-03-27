import { Column, PrimaryGeneratedColumn } from 'typeorm';
import { TenantScoped } from '../decorators/tenant-scoped.decorator';

@TenantScoped()
export abstract class TenantScopedEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  tenantId: string;
} 