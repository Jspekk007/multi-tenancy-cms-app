import { protectedProcedure } from '@backend/trpc';

export const tenantsProcedure = protectedProcedure.query(async ({ ctx }) => {
  if (ctx.authContext) {
    return ctx.authContext.tenants;
  }

  const { AuthService } = await import('../auth.service');
  const authService = new AuthService();

  return await authService.getUserTenants(ctx.user.userId);
});
