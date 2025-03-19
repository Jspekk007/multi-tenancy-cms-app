import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { ConfigService } from '@nestjs/config'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { User } from '../../user/user.entity'
import { RefreshToken } from '../entities/refresh-token.entity'
import { MoreThan } from 'typeorm'

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'refresh'
) {
  constructor(
    private configService: ConfigService,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(RefreshToken)
    private refreshTokenRepository: Repository<RefreshToken>
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_REFRESH_SECRET'),
    })
  }

  async validate(payload: any) {
    const refreshToken = await this.refreshTokenRepository.findOne({
      where: {
        token: payload.token,
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

    return {
      id: user.id,
      email: user.email,
      tenantId: user.tenantId,
      roles: user.roles,
      refreshTokenId: refreshToken.id,
    }
  }
}
