import { IsEmail, IsNotEmpty, MinLength } from 'class-validator'
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  ManyToMany,
  JoinTable,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { Tenant } from '../tenant/tenant.entity'
import { Role } from '../auth/entities/role.entity'
import { UserRole } from '../auth/entities/user-role.entity'

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  @IsEmail({}, { message: 'Invalid email format' })
  @IsNotEmpty()
  email: string

  @Column()
  @IsNotEmpty()
  @MinLength(8, { message: 'Password must be at least 8 characters long.' })
  password: string

  @Column()
  tenantId: string

  @ManyToOne(() => Tenant, tenant => tenant.users, { eager: true })
  tenant: Tenant

  @OneToMany(() => UserRole, userRole => userRole.user)
  userRoles: UserRole[]

  @ManyToMany(() => Role)
  @JoinTable({
    name: 'user_roles',
    joinColumn: { name: 'userId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'roleId', referencedColumnName: 'id' },
  })
  roles: Role[]

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
