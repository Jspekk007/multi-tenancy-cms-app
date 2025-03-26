import { IsEmail, IsString, IsNotEmpty, IsArray, IsUUID } from 'class-validator'

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string

  @IsString()
  @IsNotEmpty()
  password: string

  @IsString()
  @IsNotEmpty()
  tenantId: string

  @IsArray()
  @IsUUID('4', { each: true })
  roleIds: string[]
}
