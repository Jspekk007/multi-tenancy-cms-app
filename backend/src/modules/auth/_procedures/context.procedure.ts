import { protectedProcedure } from '@backend/trpc';

export const contextProcedure = protectedProcedure.query(async ({ ctx }) => {
  if (ctx.authContext) {
    return ctx.authContext;
  }

  const { AuthService } = await import('../auth.service');
  const authService = new AuthService();

  return await authService.getAuthContext(ctx.user.userId, ctx.tenantId);
});
