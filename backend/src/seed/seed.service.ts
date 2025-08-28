import { Injectable, Logger } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { User } from '../modules/core/user/user.entity'
import { Tenant } from '../modules/core/tenant/tenant.entity'
import { Role } from '../modules/core/auth/entities/role.entity'
import { UserRole } from '../modules/core/auth/entities/user-role.entity'
import { AuthService } from '../modules/core/auth/auth.service'

@Injectable()
export class SeedService {
  private readonly logger = new Logger(SeedService.name)

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Tenant)
    private readonly tenantRepository: Repository<Tenant>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(UserRole)
    private readonly userRoleRepository: Repository<UserRole>,
    private readonly authService: AuthService
  ) {}

  async seed() {
    // Check if seeding is needed
    const isSeeded = await this.checkIfSeeded()
    if (isSeeded) {
      this.logger.log('Database already seeded')
      return
    }

    this.logger.log('Seeding database...')

    // Seed in the correct order
    await this.seedTenants()
    await this.seedRoles()
    await this.seedUsers()
    await this.seedUserRoles()

    this.logger.log('Database seeding completed')
  }

  private async checkIfSeeded(): Promise<boolean> {
    const adminCount = await this.userRepository.count({
      where: { email: 'admin@example.com' },
    })
    return adminCount > 0
  }

  private async seedTenants() {
    this.logger.log('Seeding tenants...')

    const tenants = [
      { name: 'Default Tenant', domain: 'default.example.com', isActive: true },
      { name: 'Demo Tenant', domain: 'demo.example.com', isActive: true },
    ]

    for (const tenantData of tenants) {
      const exists = await this.tenantRepository.findOne({
        where: { domain: tenantData.domain },
      })
      if (!exists) {
        await this.tenantRepository.save(
          this.tenantRepository.create(tenantData)
        )
      }
    }
  }

  private async seedRoles() {
    this.logger.log('Seeding roles...')

    const roles = [
      {
        name: 'Admin',
        description: 'System administrator with full access',
      },
      {
        name: 'Editor',
        description: 'Can edit content but not manage users',
      },
      {
        name: 'Viewer',
        description: 'Read-only access to content',
      },
    ]

    for (const roleData of roles) {
      const exists = await this.roleRepository.findOne({
        where: { name: roleData.name },
      })
      if (!exists) {
        await this.roleRepository.save(this.roleRepository.create(roleData))
      }
    }
  }

  private async seedUsers() {
    this.logger.log('Seeding users...')

    const defaultTenant = await this.tenantRepository.findOne({
      where: { domain: 'default.example.com' },
    })

    const users = [
      {
        email: 'admin@example.com',
        name: 'System Admin',
        password: 'admin123', // In a real app, hash this password
        tenantId: defaultTenant.id,
        isActive: true,
      },
      {
        email: 'editor@example.com',
        name: 'Content Editor',
        password: 'editor123', // In a real app, hash this password
        tenantId: defaultTenant.id,
        isActive: true,
      },
      {
        email: 'viewer@example.com',
        name: 'Content Viewer',
        password: 'viewer123', // In a real app, hash this password
        tenantId: defaultTenant.id,
        isActive: true,
      },
    ]

    // In a real application, hash the passwords before saving
    for (const userData of users) {
      const exists = await this.userRepository.findOne({
        where: { email: userData.email },
      })
      if (!exists) {
        // Hash the password before saving
        const hashedPassword = await this.authService.hashPassword(
          userData.password
        )
        await this.userRepository.save(
          this.userRepository.create({
            ...userData,
            password: hashedPassword,
          })
        )
      }
    }
  }

  private async seedUserRoles() {
    this.logger.log('Seeding user roles...')

    // Get users
    const admin = await this.userRepository.findOne({
      where: { email: 'admin@example.com' },
    })
    const editor = await this.userRepository.findOne({
      where: { email: 'editor@example.com' },
    })
    const viewer = await this.userRepository.findOne({
      where: { email: 'viewer@example.com' },
    })

    // Get roles
    const adminRole = await this.roleRepository.findOne({
      where: { name: 'Admin' },
    })
    const editorRole = await this.roleRepository.findOne({
      where: { name: 'Editor' },
    })
    const viewerRole = await this.roleRepository.findOne({
      where: { name: 'Viewer' },
    })

    // Assign roles
    const userRoles = [
      { user: { id: admin.id }, role: { id: adminRole.id } },
      { user: { id: editor.id }, role: { id: editorRole.id } },
      { user: { id: viewer.id }, role: { id: viewerRole.id } },
    ]

    for (const userRoleData of userRoles) {
      const exists = await this.userRoleRepository.findOne({
        where: {
          user: { id: userRoleData.user.id },
          role: { id: userRoleData.role.id },
        },
      })

      if (!exists) {
        await this.userRoleRepository.save(
          this.userRoleRepository.create(userRoleData)
        )
      }
    }
  }
}
