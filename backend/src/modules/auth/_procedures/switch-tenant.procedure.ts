import { protectedProcedure } from '@backend/trpc';

import { switchTenantInputSchema } from '../auth.types';

export const switchTenantProcedure = protectedProcedure
  .input(switchTenantInputSchema)
  .mutation(async ({ ctx, input }) => {
    const { AuthService } = await import('../auth.service');
    const authService = new AuthService();

    return await authService.switchTenant(ctx.user.userId, input.tenantId, ctx.user.sessionId);
  });
