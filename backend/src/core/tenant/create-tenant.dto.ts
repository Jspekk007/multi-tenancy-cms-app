import { IsNotEmpty, IsString, Length } from 'class-validator'
import { IsDomain } from '../../utils/validators/is-domain.validator'

export class CreateTenantDto {
  @IsString()
  @IsNotEmpty()
  @Length(3, 50, { message: 'Name must be between 3 and 50 characters' })
  name: string

  @IsString()
  @IsNotEmpty()
  @IsDomain({ message: 'Please provide a valid domain (eg., example.com)' })
  domain: string
}
