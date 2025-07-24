import { DataSource } from 'typeorm'
import { User } from '../modules/core/user/user.entity'
import { Tenant } from '../modules/core/tenant/tenant.entity'
import { Role } from '../modules/core/auth/entities/role.entity'
import { UserRole } from '../modules/core/auth/entities/user-role.entity'
import { RefreshToken } from '../modules/core/auth/entities/refresh-token.entity'
import * as dotenv from 'dotenv'
import * as path from 'path'

// Load .env file from the root directory
dotenv.config({ path: path.resolve(__dirname, '../../../.env') })

// Determine if we're running in Docker or locally
const isDocker = process.env.DOCKER === 'true'
const host = isDocker ? process.env.DATABASE_HOST : 'localhost'

export const AppDataSource = new DataSource({
  type: 'postgres',
  host,
  port: parseInt(process.env.DB_PORT) || 5432,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  synchronize: false,
  logging: true,
  entities: [User, Tenant, Role, UserRole, RefreshToken],
  migrations: [path.join(__dirname, '../migrations/*.ts')],
  subscribers: [],
})
