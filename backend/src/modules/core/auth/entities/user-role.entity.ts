import {
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm'
import { User } from '../../user/user.entity'
import { Role } from './role.entity'

@Entity('user_roles')
export class UserRole {
  @PrimaryColumn()
  userId: string

  @PrimaryColumn()
  roleId: string

  @ManyToOne(() => User, (user) => user.userRoles)
  user: User

  @ManyToOne(() => Role, (role) => role.userRoles)
  role: Role

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
