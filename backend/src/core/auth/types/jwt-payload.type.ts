import { Role } from '../entities/role.entity'

export interface JwtPayload {
  token?: string
  email: string
  sub: string
  tenantId: string
  iat?: number
  exp?: number
  roles?: string[]
}

export interface ValidatedUser {
  id: string
  email: string
  tenantId: string
  roles: Role[]
  refreshTokenId: string
}
