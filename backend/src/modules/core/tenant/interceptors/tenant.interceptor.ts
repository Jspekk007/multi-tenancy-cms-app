import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { TenantContext } from '../tenant.context';

@Injectable()
export class TenantInterceptor implements NestInterceptor {
  constructor(
    private readonly tenantContext: TenantContext,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user || !user.tenantId) {
      return next.handle();
    }

    // Get the repository from the request
    const repository = request.repository;
    if (!repository) {
      return next.handle();
    }

    // Add tenant filter to the query
    const originalFind = repository.find;
    repository.find = function(options: any) {
      if (!options) {
        options = {};
      }
      if (!options.where) {
        options.where = {};
      }
      options.where.tenantId = user.tenantId;
      return originalFind.call(this, options);
    };

    return next.handle();
  }
} 