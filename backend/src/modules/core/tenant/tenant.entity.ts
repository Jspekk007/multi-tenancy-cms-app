import { IsNotEmpty, IsString, Length } from 'class-validator'
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { IsDomain } from '../../../utils/validators/is-domain.validator'
import { User } from '../user/user.entity'

@Entity('tenants')
export class Tenant {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  @IsString()
  @IsNotEmpty()
  @Length(3, 50)
  name: string

  @Column({ unique: true })
  @IsNotEmpty()
  @IsDomain({ message: 'Please provide a valid domain (eg., example.com' })
  domain: string

  @OneToMany(() => User, (user) => user.tenant)
  users: User[]

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
