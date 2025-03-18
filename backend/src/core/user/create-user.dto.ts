import { IsEmail, IsNotEmpty, IsString, MinLength, IsUUID, IsArray, IsOptional } from 'class-validator'

export class CreateUserDto {
  @IsEmail({}, { message: 'Invalid email format' })
  @IsNotEmpty()
  email: string

  @IsString()
  @IsNotEmpty()
  @MinLength(8, { message: 'Password must be at least 8 characters long.' })
  password: string

  @IsUUID()
  @IsNotEmpty()
  tenantId: string

  @IsArray()
  @IsUUID('4', { each: true })
  @IsOptional()
  roleIds?: string[]
}
