import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Logger,
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { User } from '../../../core/user/user.entity'

interface RequestWithUser extends Request {
  user?: User
}

@Injectable()
export class RolesGuard implements CanActivate {
  private readonly logger = new Logger(RolesGuard.name)
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    this.logger.log('Running can activate')
    const requiredRoles = this.reflector.get<string[]>(
      'roles',
      context.getHandler()
    )

    const request: RequestWithUser = context.switchToHttp().getRequest()
    const user = request.user

    this.logger.log('Full request.user object:', JSON.stringify(user, null, 2)) // Pretty-print

    if (!user || !requiredRoles) {
      this.logger.warn('User or user roles not found in request')
      return requiredRoles.length === 0
    }

    return requiredRoles.some((requiredRole) =>
      user.roles?.some((userRole) => userRole.name === requiredRole)
    )
  }
}
