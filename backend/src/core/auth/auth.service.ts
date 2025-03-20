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

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
    @InjectRepository(RefreshToken)
    private refreshTokenRepository: Repository<RefreshToken>,
    @InjectRepository(Tenant)
    private tenantRepository: Repository<Tenant>,
    private jwtService: JwtService,
    private configService: ConfigService
  ) {}

  async validateUser(email: string, password: string, tenantId: string) {
    // First, try to find tenant by domain if tenantId looks like a domain
    let tenant
    if (tenantId.includes('.')) {
      tenant = await this.tenantRepository.findOne({
        where: { domain: tenantId },
      })
    } else {
      tenant = await this.tenantRepository.findOne({
        where: { id: tenantId },
      })
    }

    if (!tenant) {
      throw new BadRequestException('Tenant not found')
    }

    const user = await this.userRepository.findOne({
      where: { email, tenant: { id: tenant.id } },
      relations: ['roles', 'tenant'],
    })

    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user
      return result
    }
    return null
  }

  async login(user: any, tenantId: string) {
    const payload = {
      email: user.email,
      sub: user.id,
      tenantId,
      roles: user.roles.map((role) => role.name),
    }

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
        expiresIn: this.configService.get('JWT_REFRESH_EXPIRATION', '7d'),
      }),
    ])

    // Store refresh token in database
    await this.refreshTokenRepository.save({
      token: refreshToken,
      userId: user.id,
      tenantId,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    })

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        roles: user.roles,
      },
    }
  }

  async refreshToken(token: string) {
    try {
      const payload = await this.jwtService.verifyAsync(token, {
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
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token')
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

    const { password: _, ...result } = user
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
