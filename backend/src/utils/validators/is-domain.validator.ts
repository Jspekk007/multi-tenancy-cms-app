import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator'

@ValidatorConstraint({ async: false })
export class IsDomainConstraint implements ValidatorConstraintInterface {
  validate(domain: string) {
    const domainRegex = /^(?!:\/\/)([a-zA-Z0-9-_]+(\.[a-zA-Z0-9-_]+)+.*)$/
    return domainRegex.test(domain)
  }

  defaultMessage(): string {
    return 'Invalid domain format'
  }
}

export function IsDomain(ValidationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: ValidationOptions,
      constraints: [],
      validator: IsDomainConstraint,
    })
  }
}
