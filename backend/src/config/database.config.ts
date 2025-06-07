import { TypeOrmModuleOptions } from '@nestjs/typeorm'
import { User } from '../modules/core/user/user.entity'
import { Tenant } from '../modules/core/tenant/tenant.entity'
import { Role } from '../modules/core/auth/entities/role.entity'
import { UserRole } from '../modules/core/auth/entities/user-role.entity'
import { RefreshToken } from '../modules/core/auth/entities/refresh-token.entity'
import { Content } from '../modules/content/entities/content.entity'
import { Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

const logger = new Logger('DatabaseConfig')
const configService = new ConfigService()

// Log environment variables
logger.debug(`DB_HOST: ${process.env.DB_HOST}`)
logger.debug(`DB_PORT: ${process.env.DB_PORT}`)
logger.debug(`DB_USERNAME: ` + configService.get<string>('DB_DATABASE'))
logger.debug(`DB_DATABASE: ${process.env.DB_DATABASE}`)
logger.debug(`DOCKER: ${process.env.DOCKER}`)

const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: configService.get<string>('DB_HOST', 'localhost'),
  port: parseInt(configService.get<string>('DB_PORT')) || 5432,
  username: configService.get<string>('DB_USERNAME'),
  password: configService.get<string>('DB_PASSWORD'),
  database: configService.get<string>('DB_DATABASE'),
  synchronize: false,
  entities: [User, Tenant, Role, UserRole, RefreshToken, Content],
  migrations: ['dist/migrations/*.js'],
  logging: true,
  logger: 'advanced-console',
  retryAttempts: 5,
  retryDelay: 3000, // 3 seconds
}

export default typeOrmConfig
