import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { User } from './user.entity'
import { Role } from '../auth/entities/role.entity'
import { CreateUserDto } from './create-user.dto'
import * as bcrypt from 'bcrypt'

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const { email, password, tenantId, roleIds } = createUserDto

    // Check if user already exists
    const existingUser = await this.userRepository.findOne({
      where: { email, tenantId },
    })

    if (existingUser) {
      throw new BadRequestException('User already exists with this email in the tenant')
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Find roles if provided
    let roles = []
    if (roleIds && roleIds.length > 0) {
      roles = await this.roleRepository.findByIds(roleIds)
      if (roles.length !== roleIds.length) {
        throw new BadRequestException('One or more role IDs are invalid')
      }
    }

    // Create and save the user
    const user = this.userRepository.create({
      email,
      password: hashedPassword,
      tenantId,
      roles,
    })

    return this.userRepository.save(user)
  }

  async findByEmail(email: string, tenantId: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { email, tenantId },
      relations: ['roles'],
    })

    if (!user) {
      throw new NotFoundException('User not found')
    }

    return user
  }

  async findById(id: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['roles'],
    })

    if (!user) {
      throw new NotFoundException('User not found')
    }

    return user
  }

  async assignRoles(userId: string, roleIds: string[]): Promise<User> {
    const user = await this.findById(userId)
    const roles = await this.roleRepository.findByIds(roleIds)

    if (roles.length !== roleIds.length) {
      throw new BadRequestException('One or more role IDs are invalid')
    }

    user.roles = roles
    return this.userRepository.save(user)
  }
}
