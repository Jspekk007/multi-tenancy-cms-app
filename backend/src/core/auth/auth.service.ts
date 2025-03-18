import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import * as bcrypt from 'bcrypt'
import { UserService } from '../user/user.service'
import { JwtService } from '@nestjs/jwt'

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService
  ) {}

  async login(email: string, password: string) {
    const user = await this.userService.findByEmail(email)
    if (!user) {
      throw new UnauthorizedException('Invalid credentials')
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials')
    }

    const token = this.jwtService.sign({ id: user.id })
    return { token }
  }

  async register(email: string, password: string) {
    const existingUser = await this.userService.findByEmail(email)
    if (existingUser) {
      throw new BadRequestException('Email already in use.')
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    return this.userService.createUser(email, hashedPassword)
  }
}
