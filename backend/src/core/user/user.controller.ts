import {
  Body,
  Controller,
  Post,
  Get,
  Param,
  UseGuards,
  ValidationPipe,
  UsePipes,
} from '@nestjs/common'
import { UserService } from './user.service'
import { CreateUserDto } from './create-user.dto'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { RolesGuard } from '../auth/guards/roles.guard'
import { Roles } from '../auth/decorators/roles.decorator'

@Controller('users')
// @UseGuards(JwtAuthGuard, RolesGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @Roles('ADMIN')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async create(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto)
  }

  @Get(':id')
  @Roles('ADMIN')
  async findById(@Param('id') id: string) {
    return this.userService.findById(id)
  }

  @Post(':id/roles')
  @Roles('ADMIN')
  async assignRoles(
    @Param('id') userId: string,
    @Body('roleIds') roleIds: string[]
  ) {
    return this.userService.assignRoles(userId, roleIds)
  }
}
