import { IsEmail, IsNotEmpty, MinLength } from 'class-validator'
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { Tenant } from '../tenant/tenant.entity'

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

  @ManyToOne(() => Tenant, { eager: true })
  tenant: Tenant

  @CreateDateColumn()
  createdAt: Date
}
