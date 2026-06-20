import { protectedProcedure } from '@backend/trpc';

import { switchTenantInputSchema } from '../auth.types';

export const switchTenantProcedure = protectedProcedure
  .input(switchTenantInputSchema)
  .mutation(async ({ ctx, input }) => {
    const { AuthService } = await import('../auth.service');
    const authService = new AuthService();
    const authContext =
      ctx.authContext ?? (await authService.getAuthContext(ctx.user.userId, ctx.tenantId));

    return await authService.switchTenant(authContext, input.tenantId, ctx.user.sessionId);
  });
