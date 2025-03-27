import { Entity, Column } from 'typeorm';
import { TenantScopedEntity } from '../../core/tenant/entities/tenant-scoped.entity';

@Entity('contents')
export class Content extends TenantScopedEntity {
  @Column()
  title: string;

  @Column('text')
  body: string;

  @Column({ default: true })
  isPublished: boolean;
} 