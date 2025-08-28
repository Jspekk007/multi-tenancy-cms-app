import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { User } from '../user/user.entity'
import { Role } from './entities/role.entity'
import { RefreshToken } from './entities/refresh-token.entity'
import { Tenant } from '../tenant/tenant.entity'
import * as bcrypt from 'bcrypt'
import { ConfigService } from '@nestjs/config'
import { MoreThan } from 'typeorm'
import { JwtPayload } from './types/jwt-payload.type'
import { TenantContext } from '../tenant/tenant.context'

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
    @InjectRepository(RefreshToken)
    private refreshTokenRepository: Repository<RefreshToken>,
    @InjectRepository(Tenant)
    private tenantRepository: Repository<Tenant>,
    private readonly jwtService: JwtService,
    private configService: ConfigService,
    private readonly tenantContext: TenantContext
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userRepository.findOne({
      where: { email },
      relations: ['tenant'],
    })

    if (user && (await bcrypt.compare(password, user.password))) {
      const { password: _, ...result } = user
      return result
    }
    return null
  }

  async login(user: any) {
    const tenant = this.tenantContext.getTenant()
    if (!tenant) {
      throw new UnauthorizedException('Tenant not found')
    }

    const payload = {
      email: user.email,
      sub: user.id,
      tenantId: tenant.id,
    }

    return {
      access_token: this.jwtService.sign(payload),
      refresh_token: this.jwtService.sign(payload, {
        expiresIn: process.env.JWT_REFRESH_EXPIRATION,
      }),
    }
  }

  async refreshToken(token: string) {
    try {
      const payload: JwtPayload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
      })

      const refreshToken = await this.refreshTokenRepository.findOne({
        where: {
          token,
          userId: payload.sub,
          tenantId: payload.tenantId,
          expiresAt: MoreThan(new Date()),
        },
      })

      if (!refreshToken) {
        throw new UnauthorizedException('Invalid refresh token')
      }

      const user = await this.userRepository.findOne({
        where: { id: payload.sub },
        relations: ['roles'],
      })

      if (!user) {
        throw new UnauthorizedException('User not found')
      }

      const newPayload = {
        email: user.email,
        sub: user.id,
        tenantId: user.tenant.id,
        roles: user.roles?.map((role) => role.name) || [],
      }

      const [newAccessToken, newRefreshToken] = await Promise.all([
        this.jwtService.signAsync(newPayload),
        this.jwtService.signAsync(newPayload, {
          secret: this.configService.get('JWT_REFRESH_SECRET'),
          expiresIn: this.configService.get('JWT_REFRESH_EXPIRATION', '7d'),
        }),
      ])

      // Update refresh token in database
      await this.refreshTokenRepository.update(refreshToken.id, {
        token: newRefreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      })

      return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      }
    } catch (error: unknown) {
      throw new UnauthorizedException('Invalid refresh token: ', error)
    }
  }

  async logout(userId: string, tenantId: string) {
    await this.refreshTokenRepository.delete({ userId, tenantId })
  }

  async createUser(
    email: string,
    password: string,
    tenantId: string,
    roleIds: string[]
  ) {
    const hashedPassword = await bcrypt.hash(password, 10)

    const roles = await this.roleRepository.findByIds(roleIds)
    const user = await this.userRepository.save({
      email,
      password: hashedPassword,
      tenant: { id: tenantId },
      roles,
    })

    const { ...result } = user
    return result
  }

  async assignRole(userId: string, roleId: string, tenantId: string) {
    const user = await this.userRepository.findOne({
      where: { id: userId, tenant: { id: tenantId } },
      relations: ['roles', 'tenant'],
    })

    if (!user) {
      throw new BadRequestException('User not found')
    }

    const role = await this.roleRepository.findOne({
      where: { id: roleId },
    })

    if (!role) {
      throw new BadRequestException('Role not found')
    }

    user.roles.push(role)
    await this.userRepository.save(user)

    return user
  }

  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt()
    return bcrypt.hash(password, salt)
  }

  async comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash)
  }
}
