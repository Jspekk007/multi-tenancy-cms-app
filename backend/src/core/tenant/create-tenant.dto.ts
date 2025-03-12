import { IsNotEmpty, IsString, Length } from 'class-validator'
import { IsDomain } from '../../utils/validators/is-domain.validator'

export class CreateTenantDto {
  @IsString()
  @IsNotEmpty()
  @Length(3, 50)
  name: string

  @IsNotEmpty()
  @IsDomain({ message: 'Please provide a valid domain (e.g., example.com)' })
  domain: string
}
