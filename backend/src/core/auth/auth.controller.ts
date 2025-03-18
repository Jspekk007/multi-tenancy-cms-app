import { Controller, Post } from '@nestjs/common'
import { AuthService } from './auth.service'
import { LoginDto } from './login.dto'

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(loginDto: LoginDto) {
    return this.authService.login(loginDto.username, loginDto.password)
  }

  @Post('register')
  async register(loginDto: LoginDto) {
    return this.authService.register(loginDto.username, loginDto.password)
  }
}
