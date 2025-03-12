import { IsNotEmpty, IsString, Length } from 'class-validator'
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { IsDomain } from '../../utils/validators/is-domain.validator'

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

  @CreateDateColumn()
  createdAt: Date
}
