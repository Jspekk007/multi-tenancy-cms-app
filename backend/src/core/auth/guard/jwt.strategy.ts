import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { UserService } from '../../../core/user/user.service'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    })
  }

  async validate(payload: { userId: number }) {
    try {
      const user = await this.userService.findByUserId(
        payload.userId.toString()
      )

      if (!user) {
        throw new UnauthorizedException('User not found')
      }

      return user
    } catch (error) {
      console.error('Validation failed: ', error)
      throw new UnauthorizedException('Validation failed.')
    }
  }
}
