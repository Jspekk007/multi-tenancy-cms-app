import { TypeOrmModuleOptions } from '@nestjs/typeorm'
import { User } from '../modules/core/user/user.entity'
import { Tenant } from '../modules/core/tenant/tenant.entity'
import { Role } from '../modules/core/auth/entities/role.entity'
import { UserRole } from '../modules/core/auth/entities/user-role.entity'
import { RefreshToken } from '../modules/core/auth/entities/refresh-token.entity'

const isDocker = process.env.DOCKER === 'true'

const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: isDocker ? 'postgres' : 'localhost',
  port: parseInt(process.env.DB_PORT) || 5432,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  synchronize: false,
  entities: [User, Tenant, Role, UserRole, RefreshToken],
  migrations: ['dist/migrations/*.js'],
  logging: true,
  logger: 'advanced-console',
  retryAttempts: 5,
  retryDelay: 3000, // 3 seconds
}

export default typeOrmConfig
