import { IsString, IsNotEmpty, IsUUID } from 'class-validator';

export class AssignRoleDto {
  @IsUUID('4')
  @IsNotEmpty()
  userId: string;

  @IsUUID('4')
  @IsNotEmpty()
  roleId: string;

  @IsString()
  @IsNotEmpty()
  tenantId: string;
} 