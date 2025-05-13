import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { JwtStrategy } from './strategies/jwt.strategy'
import { RefreshTokenStrategy } from './strategies/refresh-token.strategy'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { User } from '../user/user.entity'
import { Role } from './entities/role.entity'
import { RefreshToken } from './entities/refresh-token.entity'
import { Tenant } from '../tenant/tenant.entity'

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        return {
          secret: configService.get('JWT_SECRET'),
          signOptions: {
            expiresIn: configService.get('JWT_EXPIRATION'),
          },
        }
      },
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([User, Role, RefreshToken, Tenant]),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, RefreshTokenStrategy],
  exports: [AuthService, JwtStrategy, PassportModule],
})
export class AuthModule {}
