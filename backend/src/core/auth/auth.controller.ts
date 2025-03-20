import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  UnauthorizedException,
  Logger,
} from '@nestjs/common'
import { AuthService } from './auth.service'
import { LoginDto } from './dto/login.dto'
import { RefreshTokenDto } from './dto/refresh-token.dto'
import { JwtAuthGuard } from './guards/jwt-auth.guard'
import { RefreshTokenGuard } from './guards/refresh-token.guard'
import { RolesGuard } from './guards/roles.guard'
import { Roles } from './decorators/roles.decorator'
import { CreateUserDto } from './dto/create-user.dto'
import { AssignRoleDto } from './dto/assign-role.dto'

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name)
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    this.logger.log(`Login request received: ${JSON.stringify(loginDto)}`)
    const user = await this.authService.validateUser(
      loginDto.email,
      loginDto.password,
      loginDto.tenantId
    )

    if (!user) {
      throw new UnauthorizedException('Invalid credentials')
    }

    return this.authService.login(user, loginDto.tenantId)
  }

  @UseGuards(RefreshTokenGuard)
  @Post('refresh')
  async refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshToken(refreshTokenDto.refreshToken)
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@Req() req) {
    return this.authService.logout(req.user.id, req.user.tenantId)
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Admin')
  @Post('users')
  async createUser(@Body() createUserDto: CreateUserDto) {
    return this.authService.createUser(
      createUserDto.email,
      createUserDto.password,
      createUserDto.tenantId,
      createUserDto.roleIds
    )
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Admin')
  @Post('users/:userId/roles')
  async assignRole(@Body() assignRoleDto: AssignRoleDto) {
    return this.authService.assignRole(
      assignRoleDto.userId,
      assignRoleDto.roleId,
      assignRoleDto.tenantId
    )
  }
}
